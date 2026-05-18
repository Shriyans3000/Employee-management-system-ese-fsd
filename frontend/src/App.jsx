import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Sparkles, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import AIRecommendations from './pages/AIRecommendations';
import Auth from './pages/Auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-brutal-bg text-brutal-black">
        {/* Navbar */}
        <nav className="bg-brutal-pink border-b-4 border-brutal-black sticky top-0 z-10 shadow-brutal mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-20 py-4 sm:py-0">
              <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-0">
                <div className="bg-white border-4 border-brutal-black shadow-brutal-sm p-1 mr-3 transform -rotate-3">
                  <Sparkles className="h-8 w-8 text-brutal-black" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight uppercase">HR Analytics AI</span>
              </div>
              
              {token && (
                <div className="flex flex-wrap justify-center sm:items-center gap-3">
                  <Link to="/" className="brutal-btn-blue text-sm flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link to="/add" className="brutal-btn-green text-sm flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Link>
                  <Link to="/ai" className="brutal-btn text-sm flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Analysis
                  </Link>
                  <button onClick={handleLogout} className="bg-brutal-black text-white px-4 py-2 font-bold uppercase border-2 border-transparent hover:bg-white hover:text-brutal-black hover:border-brutal-black transition-colors flex items-center text-sm ml-4">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Routes>
            {!token ? (
              <>
                <Route path="*" element={<Auth setToken={setToken} />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/add" element={<AddEmployee token={token} />} />
                <Route path="/ai" element={<AIRecommendations token={token} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
