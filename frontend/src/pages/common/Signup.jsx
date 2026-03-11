import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    role: 'driver', 
    phone: '', 
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await API.post('/auth/signup', formData);
      login(response.data);
      
      // Navigate based on role - role check page logic
      const userRole = response.data.user?.role || response.data.role;
      if (userRole === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (userRole === 'vehicleadmin') {
        navigate('/vehicleadmin/dashboard');
      } else {
        navigate('/driver/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'driver', label: 'Driver', icon: '🚗', desc: 'Rent and drive vehicles' },
    { value: 'vehicleadmin', label: 'Vehicle Admin', icon: '🏢', desc: 'Manage vehicle fleet' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 py-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-2xl">🚗</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RentEase
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Join us and start your journey today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Role Selection */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-white mb-3">
                Choose Your Role
              </h2>
              <p className="text-blue-100 mb-6 text-sm">
                Select the role that best describes you
              </p>
              
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                      formData.role === role.value
                        ? 'bg-white text-blue-600 shadow-lg scale-105'
                        : 'bg-white/10 border border-white/30 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{role.icon}</span>
                      <div>
                        <div className="font-semibold text-base">{role.label}</div>
                        <div className={`text-xs mt-1 ${
                          formData.role === role.value ? 'text-blue-500' : 'text-blue-200'
                        }`}>{role.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-blue-100 text-sm">
                  Already have an account?
                </p>
                <Link 
                  to="/login" 
                  className="text-white font-semibold hover:underline mt-1 inline-block transition"
                >
                  Sign In →
                </Link>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Create a password (min 6 characters)"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      placeholder="Enter your address"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/70 backdrop-blur rounded-xl p-3 hover:shadow-md transition">
            <div className="text-2xl mb-1">🔒</div>
            <div className="font-semibold text-gray-900 text-sm">Secure</div>
            <div className="text-xs text-gray-600">Data protected</div>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-xl p-3 hover:shadow-md transition">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-semibold text-gray-900 text-sm">Fast</div>
            <div className="text-xs text-gray-600">Quick setup</div>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-xl p-3 hover:shadow-md transition">
            <div className="text-2xl mb-1">💰</div>
            <div className="font-semibold text-gray-900 text-sm">Free</div>
            <div className="text-xs text-gray-600">No charges</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


