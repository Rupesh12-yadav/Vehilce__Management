import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Driver Dashboard</h1>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        </div>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl mb-4">Welcome, {user?.name}!</h2>
        
        {/* Quick Actions */}
        <div className="mb-6">
          <a href="/driver/search" className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600">
            Search Vehicles
          </a>
          <a href="/driver/bookings" className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600">
            My Bookings
          </a>
          <a href="/driver/payments" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Payment History
          </a>
          <a href="/profile" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            My Profile
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg" onClick={() => window.location.href='/driver/search'}>
            <h3 className="text-lg font-bold">Available Vehicles</h3>
            <p className="text-2xl font-bold text-blue-600">Search</p>
            <p className="text-sm text-gray-600">Find & book vehicles</p>
          </div>
          <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg" onClick={() => window.location.href='/driver/bookings'}>
            <h3 className="text-lg font-bold">My Bookings</h3>
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Active bookings</p>
          </div>
          <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg" onClick={() => window.location.href='/driver/payments'}>
            <h3 className="text-lg font-bold">Payments</h3>
            <p className="text-2xl font-bold text-purple-600">₹0</p>
            <p className="text-sm text-gray-600">Payment history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;