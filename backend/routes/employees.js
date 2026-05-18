const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

// Add Employee
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;
    if (!name || !email || !department || !skills || performanceScore === undefined || experience === undefined) {
      return res.status(400).json({ error: 'Validation error: Missing fields' });
    }
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Error message: Duplicate email' });
    }
    const employee = new Employee({ name, email, department, skills, performanceScore, experience });
    await employee.save();
    res.status(201).json({ message: 'Employee stored successfully', employee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get All Employees
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Search Employee
router.get('/search', auth, async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ error: 'Department query parameter is required' });
    }
    const employees = await Employee.find({ department: { $regex: new RegExp(department, 'i') } });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Employee
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Employee
router.delete('/:id', auth, async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
