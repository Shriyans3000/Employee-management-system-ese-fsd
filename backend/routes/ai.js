const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Employee = require('../models/Employee');

router.post('/recommend', auth, async (req, res) => {
  try {
    const { employeeIds } = req.body;
    if (!employeeIds || employeeIds.length === 0) {
      return res.status(400).json({ error: 'Please provide employee IDs' });
    }
    
    const mongoose = require('mongoose');
    const validIds = employeeIds.map(id => new mongoose.Types.ObjectId(id));
    const employees = await Employee.find({ _id: { $in: validIds } });
    console.log('Found Employees Length:', employees.length);
    
    const prompt = `Analyze the following employees and provide recommendations.
    For high performance employees (>80), provide a "Promotion suggestion".
    For low score employees (<50), provide "Improvement feedback".
    For employees with missing or few skills, provide "Skill enhancement recommendation".
    If there are multiple employees, provide "Ranked recommendations".
    
    Employees:
    ${JSON.stringify(employees.map(e => ({name: e.name, department: e.department, skills: e.skills, performanceScore: e.performanceScore, experience: e.experience})), null, 2)}
    
    Return a detailed analysis.`;

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
        return res.status(500).json({ error: 'AI API Key is missing' });
    }
    console.log('Using API Key starts with:', openRouterApiKey.substring(0, 15));

    const https = require('https');
    const agent = new https.Agent({  
      rejectUnauthorized: false,
      keepAlive: true
    });

    let aiResponse = '';
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500
      }, {
        httpsAgent: agent,
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });
      aiResponse = response.data.choices[0].message.content;
    } catch (apiError) {
      console.log('First attempt failed, retrying...', apiError.message);
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500
      }, {
        httpsAgent: agent,
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });
      aiResponse = response.data.choices[0].message.content;
    }

    res.json({ recommendation: aiResponse });
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch AI recommendation' });
  }
});

module.exports = router;
