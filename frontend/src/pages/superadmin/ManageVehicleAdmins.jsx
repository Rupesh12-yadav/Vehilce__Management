import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const ManageVehicleAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await API.get('/users?role=vehicleadmin');
      const allAdmins = response.data.data;
      
      setAdmins(allAdmins.filter(admin => admin.isVerified));
      setPendingAdmins(allAdmins.filter(admin => !admin.isVerified));
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
    setLoading(false);
  };

  const handleApproval = async (adminId, action) => {
    try {
      await API.put(`/users/${adminId}`, {
        isVerified: action === 'approve',
        isActive: action === 'approve'
      });
      
      alert(`Vehicle Admin ${action}d successfully`);
      fetchAdmins();
    } catch (error) {
      alert('Error updating admin status');
    }
  };

  const toggleAdminStatus = async (adminId, currentStatus) => {
    try {
      await API.put(`/users/${adminId}`, { isActive: !currentStatus });
      fetchAdmins();
      alert('Admin status updated successfully');
    } catch (error) {
      alert('Error updating admin status');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.location.href = '/superadmin/dashboard'}
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">Manage Vehicle Admins</h2>
      </div>

      {/* Pending Approvals */}
      {pendingAdmins.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-yellow-600">
            Pending Approvals ({pendingAdmins.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAdmins.map((admin) => (
              <div key={admin._id} className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold">{admin.name}</h4>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <p className="text-sm text-gray-600">{admin.phone}</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Pending
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p>Address: {admin.address}</p>
                  <p>Joined: {new Date(admin.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(admin._id, 'approve')}
                    className="flex-1 bg-green-500 text-white py-2 px-3 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(admin._id, 'reject')}
                    className="flex-1 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Admins */}
      <div>
        <h3 className="text-xl font-bold mb-4">
          Approved Vehicle Admins ({admins.length})
        </h3>
        
        {admins.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No approved vehicle admins found</p>
          </div>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                        <div className="text-xs text-gray-400">
                          Joined: {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{admin.phone}</div>
                      <div className="text-gray-500 text-xs">{admin.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isActive ? 'Active' : 'Blocked'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          admin.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {admin.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>Vehicles: {admin.stats?.totalVehicles || 0}</div>
                      <div>Bookings: {admin.stats?.totalBookings || 0}</div>
                      <div>Earnings: ₹{admin.stats?.totalEarnings || 0}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleAdminStatus(admin._id, admin.isActive)}
                        className={`px-3 py-1 rounded text-xs ${
                          admin.isActive 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {admin.isActive ? 'Block' : 'Unblock'}
                      </button>
                      <button
                        onClick={() => window.location.href = `/admin/${admin._id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-blue-600">{admins.length + pendingAdmins.length}</h3>
          <p className="text-gray-600">Total Admins</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-green-600">{admins.length}</h3>
          <p className="text-gray-600">Approved</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-yellow-600">{pendingAdmins.length}</h3>
          <p className="text-gray-600">Pending</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-red-600">
            {admins.filter(a => !a.isActive).length}
          </h3>
          <p className="text-gray-600">Blocked</p>
        </div>
      </div>
    </div>
  );
};

export default ManageVehicleAdmins;

