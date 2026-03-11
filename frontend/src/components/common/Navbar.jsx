import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    const dashboardRoutes = {
      superadmin: { path: '/superadmin/dashboard', label: 'Dashboard' },
      vehicleadmin: { path: '/vehicleadmin/dashboard', label: 'Dashboard' },
      driver: { path: '/driver/dashboard', label: 'Dashboard' }
    };
    return dashboardRoutes[user.role] || null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-xl">🚗</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RentEase
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/vehicles" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
              Vehicles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                {dashboardLink && (
                  <Link to={dashboardLink.path} className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
                    {dashboardLink.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">({user.role})</span>
                </div>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2.5 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link to="/" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Home</Link>
              <Link to="/vehicles" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Vehicles</Link>
              <Link to="/about" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">About</Link>
              <Link to="/contact" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Contact</Link>
              {user && dashboardLink && (
                <Link to={dashboardLink.path} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                  {dashboardLink.label}
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left">
                  Logout
                </button>
              ) : (
                <div className="flex gap-3 px-4">
                  <Link to="/login" className="flex-1 px-4 py-2 text-center border border-blue-600 text-blue-600 rounded-lg">
                    Login
                  </Link>
                  <Link to="/signup" className="flex-1 px-4 py-2 text-center bg-blue-600 text-white rounded-lg">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


