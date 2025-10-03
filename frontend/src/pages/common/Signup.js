import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'driver', phone: '', address: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/signup', formData);
      login(response.data);
      
      // Navigate based on role
      if (response.data.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (response.data.role === 'vehicleadmin') {
        navigate('/vehicleadmin/dashboard');
      } else {
        navigate('/driver/dashboard');
      }
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <select
            className="w-full p-3 border rounded"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="driver">Driver</option>
            <option value="vehicleadmin">Vehicle Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <input
            type="tel"
            placeholder="Phone"
            className="w-full p-3 border rounded"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <textarea
            placeholder="Address"
            className="w-full p-3 border rounded"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;