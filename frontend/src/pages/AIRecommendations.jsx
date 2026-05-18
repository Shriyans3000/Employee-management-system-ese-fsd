import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Loader } from 'lucide-react';

const AIRecommendations = ({ token }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://employee-management-system-ese.onrender.com'}/api/employees`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);
      } catch {
        setError('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, [token]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const generateRecommendation = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one employee');
      return;
    }
    
    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://employee-management-system-ese.onrender.com'}/api/ai/recommend`, {
        employeeIds: selectedIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendation(res.data.recommendation);
    } catch {
      setError('Failed to fetch AI recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Selection Column */}
        <div className="bg-white border-4 border-brutal-black shadow-brutal p-6">
          <h2 className="text-2xl font-extrabold uppercase mb-6">Select Employees</h2>
          
          {error && !loading && (
            <div className="bg-brutal-pink p-3 mb-4 border-4 border-brutal-black font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {employees.map(emp => (
              <div 
                key={emp._id}
                onClick={() => toggleSelect(emp._id)}
                className={`p-4 border-4 border-brutal-black cursor-pointer transition-colors ${
                  selectedIds.includes(emp._id) ? 'bg-brutal-yellow' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{emp.name}</h3>
                    <p className="text-sm">{emp.department}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Score: {emp.performanceScore}</div>
                    <div className="text-xs">{emp.skills.length} skills</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={generateRecommendation}
            disabled={loading}
            className={`brutal-btn w-full mt-6 flex justify-center items-center py-4 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
            {loading ? 'Analyzing...' : 'Generate AI Analysis'}
          </button>
        </div>

        {/* Results Column */}
        <div className="bg-white border-4 border-brutal-black shadow-brutal p-6 flex flex-col">
          <h2 className="text-2xl font-extrabold uppercase mb-6 flex items-center text-brutal-blue">
            <Sparkles className="mr-2" /> AI Recommendations
          </h2>
          
          <div className="flex-grow border-4 border-brutal-black bg-gray-50 p-6 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Loader className="w-12 h-12 animate-spin mb-4 text-brutal-blue" />
                <p className="font-bold uppercase animate-pulse">Consulting the AI...</p>
              </div>
            ) : recommendation ? (
              <div className="prose max-w-none">
                {/* Simple markdown parsing for bold text and lists */}
                {recommendation.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 font-medium">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-bold uppercase text-center">
                Select employees and generate<br/>analysis to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
