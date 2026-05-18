import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus } from 'lucide-react';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        navigate('/');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, formData);
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white border-4 border-brutal-black shadow-brutal p-8">
        <h2 className="text-3xl font-extrabold mb-6 uppercase tracking-tight text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        {error && (
          <div className={`p-3 mb-6 border-2 border-brutal-black font-bold ${error.includes('successful') ? 'bg-brutal-green' : 'bg-brutal-pink'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border-2 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-yellow"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border-2 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-yellow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border-2 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-yellow"
              required
            />
          </div>
          
          <button type="submit" className="brutal-btn-blue w-full flex justify-center items-center py-3">
            {isLogin ? <LogIn className="mr-2" /> : <UserPlus className="mr-2" />}
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-bold">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ username: '', email: '', password: '' });
            }}
            className="text-blue-600 hover:underline font-bold mt-2 uppercase"
          >
            {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
