import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const AddEmployee = ({ token }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const payload = {
        ...formData,
        skills: skillsArray,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/employees`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStatus({ type: 'success', message: 'Employee stored successfully' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Validation error' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border-4 border-brutal-black shadow-brutal p-8">
        <h1 className="text-3xl font-extrabold uppercase mb-6 flex items-center">
          <UserPlus className="mr-4 h-8 w-8" />
          Add Employee
        </h1>

        {status.message && (
          <div className={`p-4 mb-6 border-4 border-brutal-black font-bold ${status.type === 'success' ? 'bg-brutal-green' : 'bg-brutal-pink'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border-4 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-blue font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border-4 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-blue font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 border-4 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-blue font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
                className="w-full p-3 border-4 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-blue font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Performance Score (0-100)</label>
              <input
                type="number"
                name="performanceScore"
                value={formData.performanceScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-3 border-4 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-blue font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border-4 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-blue font-bold"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="brutal-btn-green w-full py-4 text-xl mt-4">
            Register Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
