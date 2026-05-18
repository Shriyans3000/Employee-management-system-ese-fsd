/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2 } from 'lucide-react';

const Dashboard = ({ token }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchEmployees = async (search = '') => {
    try {
      const url = search 
        ? `${import.meta.env.VITE_API_URL || 'https://employee-management-system-ese.onrender.com'}/api/employees/search?department=${search}`
        : `${import.meta.env.VITE_API_URL || 'https://employee-management-system-ese.onrender.com'}/api/employees`;
        
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch {
      setError('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchTerm);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'https://employee-management-system-ese.onrender.com'}/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees(searchTerm);
    } catch {
      setError('Failed to delete employee');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border-4 border-brutal-black shadow-brutal p-6">
        <h1 className="text-3xl font-extrabold uppercase mb-6 flex items-center">
          Employee Dashboard
        </h1>
        
        {/* Search & Filter Section */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border-4 border-brutal-black focus:outline-none focus:ring-4 focus:ring-brutal-pink font-bold"
          />
          <button type="submit" className="brutal-btn-blue flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search
          </button>
          <button 
            type="button" 
            onClick={() => { setSearchTerm(''); fetchEmployees(''); }}
            className="brutal-btn flex items-center"
          >
            Clear
          </button>
        </form>

        {error && (
          <div className="bg-brutal-pink p-4 border-4 border-brutal-black font-bold mb-6">
            {error}
          </div>
        )}

        {/* Employee List Page */}
        <div className="overflow-x-auto border-4 border-brutal-black">
          <table className="w-full text-left font-bold">
            <thead>
              <tr className="bg-brutal-yellow border-b-4 border-brutal-black text-lg uppercase">
                <th className="p-4 border-r-4 border-brutal-black">Name</th>
                <th className="p-4 border-r-4 border-brutal-black">Department</th>
                <th className="p-4 border-r-4 border-brutal-black">Performance</th>
                <th className="p-4 border-r-4 border-brutal-black">Experience</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-xl">No employees found.</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b-4 border-brutal-black hover:bg-gray-100 transition-colors">
                    <td className="p-4 border-r-4 border-brutal-black">
                      <div>{emp.name}</div>
                      <div className="text-sm font-normal">{emp.email}</div>
                    </td>
                    <td className="p-4 border-r-4 border-brutal-black">{emp.department}</td>
                    <td className="p-4 border-r-4 border-brutal-black text-center">
                      <span className={`inline-block px-3 py-1 border-2 border-brutal-black ${emp.performanceScore >= 80 ? 'bg-brutal-green' : emp.performanceScore < 50 ? 'bg-brutal-pink' : 'bg-brutal-yellow'}`}>
                        {emp.performanceScore}
                      </span>
                    </td>
                    <td className="p-4 border-r-4 border-brutal-black text-center">{emp.experience} yrs</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleDelete(emp._id)}
                        className="p-2 bg-brutal-pink border-2 border-brutal-black hover:translate-x-1 hover:translate-y-1 transition-transform"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
