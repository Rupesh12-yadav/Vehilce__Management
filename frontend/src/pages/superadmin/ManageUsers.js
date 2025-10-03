import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/users'); // adjust endpoint
      // Ensure users is an array
      setUsers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
    setLoading(false);
  };

  // Toggle active/inactive status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await API.put(`/users/${userId}`, { isActive: !currentStatus });
      fetchUsers();
      alert('User status updated successfully');
    } catch (error) {
      alert('Error updating user status');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/users/${userId}`);
        fetchUsers();
        alert('User deleted successfully');
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  // Filter users based on role
  const filteredUsers = Array.isArray(users)
    ? users.filter(user => (filter === 'all' ? true : user.role === filter))
    : [];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      {/* Header and Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/superadmin/dashboard'}
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">Manage Users</h2>
        </div>
        
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="superadmin">Super Admins</option>
          <option value="vehicleadmin">Vehicle Admins</option>
          <option value="driver">Drivers</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'superadmin' ? 'bg-red-100 text-red-800' :
                    user.role === 'vehicleadmin' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{user.phone}</div>
                  <div className="text-gray-500">{user.address}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>Rides: {user.totalRides || 0}</div>
                  <div>Rating: {user.rating || 0}/5</div>
                  <div>Earnings: ₹{user.totalEarnings || 0}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    onClick={() => toggleUserStatus(user._id, user.isActive)}
                    className={`px-3 py-1 rounded text-xs ${
                      user.isActive 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-blue-600">{users.length}</h3>
          <p className="text-gray-600">Total Users</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-green-600">
            {users.filter(u => u.role === 'driver').length}
          </h3>
          <p className="text-gray-600">Drivers</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-purple-600">
            {users.filter(u => u.role === 'vehicleadmin').length}
          </h3>
          <p className="text-gray-600">Vehicle Admins</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-red-600">
            {users.filter(u => u.isActive).length}
          </h3>
          <p className="text-gray-600">Active Users</p>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
