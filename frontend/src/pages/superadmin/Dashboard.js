import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Super Admin Dashboard</h1>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        </div>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl mb-4">Welcome, {user?.name}!</h2>
        
        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/superadmin/users" className="bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600">
            Manage Users
          </a>
          <a href="/superadmin/admins" className="bg-purple-500 text-white px-4 py-2 rounded text-center hover:bg-purple-600">
            Vehicle Admins
          </a>
          <a href="/superadmin/documents" className="bg-orange-500 text-white px-4 py-2 rounded text-center hover:bg-orange-600">
            Document Approval
          </a>
          <a href="/superadmin/reports" className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600">
            System Reports
          </a>
        </div>
        
        <div className="mb-6">
          <a href="/superadmin/complaints" className="bg-red-500 text-white px-4 py-2 rounded mr-4 hover:bg-red-600">
            Handle Complaints
          </a>
          <a href="/profile" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            My Profile
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg" onClick={() => window.location.href='/superadmin/users'}>
            <h3 className="text-lg font-bold">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600">All roles</p>
          </div>
          <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg" onClick={() => window.location.href='/superadmin/admins'}>
            <h3 className="text-lg font-bold">Vehicle Admins</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-600">Pending approval</p>
          </div>
          <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg" onClick={() => window.location.href='/superadmin/documents'}>
            <h3 className="text-lg font-bold">Documents</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-600">Pending approval</p>
          </div>
          <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg" onClick={() => window.location.href='/superadmin/reports'}>
            <h3 className="text-lg font-bold">Total Bookings</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">All time</p>
          </div>
          <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg" onClick={() => window.location.href='/superadmin/complaints'}>
            <h3 className="text-lg font-bold">Complaints</h3>
            <p className="text-3xl font-bold text-red-600">0</p>
            <p className="text-sm text-gray-600">Open issues</p>
          </div>
        </div>
        
        {/* System Health */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">• New user registrations: 0 today</p>
                <p className="text-gray-600">• New vehicle listings: 0 today</p>
                <p className="text-gray-600">• Completed bookings: 0 today</p>
                <p className="text-gray-600">• Active complaints: 0</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-4">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">• Platform uptime: 99.9%</p>
                <p className="text-gray-600">• Average response time:2s</p>
                <p className="text-gray-600">• User satisfaction: 4.8/5</p>
                <p className="text-gray-600">• Revenue this month: ₹0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;