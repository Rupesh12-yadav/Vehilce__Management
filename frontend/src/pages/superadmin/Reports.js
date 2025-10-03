import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const Reports = () => {
  const [stats, setStats] = useState({
    users: { total: 0, drivers: 0, admins: 0, active: 0 },
    vehicles: { total: 0, available: 0, booked: 0 },
    bookings: { total: 0, completed: 0, cancelled: 0, pending: 0 },
    earnings: { total: 0, thisMonth: 0 },
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Fetch all APIs in parallel
      const [usersRes, vehiclesRes, bookingsRes] = await Promise.all([
        API.get('/users').catch(e => { console.error('Users API error:', e); return { data: [] }; }),
        API.get('/vehicles').catch(e => { console.error('Vehicles API error:', e); return { data: [] }; }),
        API.get('/bookings').catch(e => { console.error('Bookings API error:', e); return { data: [] }; }),
      ]);

      // Safe extraction of data
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const vehicles = Array.isArray(vehiclesRes.data?.data) ? vehiclesRes.data.data : Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [];
      const bookings = Array.isArray(bookingsRes.data?.data) ? bookingsRes.data.data : Array.isArray(bookingsRes.data) ? bookingsRes.data : [];

      console.log('Users:', users);
      console.log('Vehicles:', vehicles);
      console.log('Bookings:', bookings);

      // Users stats
      const usersStats = {
        total: users.length,
        drivers: users.filter(u => u.role === 'driver').length,
        admins: users.filter(u => u.role === 'vehicleadmin').length,
        active: users.filter(u => u.isActive).length,
      };

      // Vehicles stats
      const vehiclesStats = {
        total: vehicles.length,
        available: vehicles.filter(v => v.availability).length,
        booked: vehicles.filter(v => !v.availability).length,
      };

      // Bookings stats
      const bookingsStats = {
        total: bookings.length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        pending: bookings.filter(b => b.status === 'pending').length,
      };

      // Earnings stats
      const earningsStats = {
        total: bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        thisMonth: bookings
          .filter(b => {
            if (!b.createdAt) return false;
            const bookingMonth = new Date(b.createdAt).getMonth();
            return b.status === 'completed' && bookingMonth === new Date().getMonth();
          })
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
      };

      setStats({
        users: usersStats,
        vehicles: vehiclesStats,
        bookings: bookingsStats,
        earnings: earningsStats,
      });

      setRecentBookings(bookings.slice(0, 10));

    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-lg font-semibold">Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => (window.location.href = '/superadmin/dashboard')}
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">System Reports</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Users */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Users</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Total:</span><span className="font-bold text-blue-600">{stats.users.total}</span></div>
            <div className="flex justify-between"><span>Drivers:</span><span className="font-bold text-green-600">{stats.users.drivers}</span></div>
            <div className="flex justify-between"><span>Admins:</span><span className="font-bold text-purple-600">{stats.users.admins}</span></div>
            <div className="flex justify-between"><span>Active:</span><span className="font-bold text-orange-600">{stats.users.active}</span></div>
          </div>
        </div>

        {/* Vehicles */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Vehicles</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Total:</span><span className="font-bold text-blue-600">{stats.vehicles.total}</span></div>
            <div className="flex justify-between"><span>Available:</span><span className="font-bold text-green-600">{stats.vehicles.available}</span></div>
            <div className="flex justify-between"><span>Booked:</span><span className="font-bold text-red-600">{stats.vehicles.booked}</span></div>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Bookings</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Total:</span><span className="font-bold text-blue-600">{stats.bookings.total}</span></div>
            <div className="flex justify-between"><span>Completed:</span><span className="font-bold text-green-600">{stats.bookings.completed}</span></div>
            <div className="flex justify-between"><span>Pending:</span><span className="font-bold text-yellow-600">{stats.bookings.pending}</span></div>
            <div className="flex justify-between"><span>Cancelled:</span><span className="font-bold text-red-600">{stats.bookings.cancelled}</span></div>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Earnings</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Total:</span><span className="font-bold text-green-600">₹{stats.earnings.total}</span></div>
            <div className="flex justify-between"><span>This Month:</span><span className="font-bold text-blue-600">₹{stats.earnings.thisMonth}</span></div>
            <div className="flex justify-between"><span>Success Rate:</span><span className="font-bold text-purple-600">{stats.bookings.total > 0 ? Math.round((stats.bookings.completed / stats.bookings.total) * 100) : 0}%</span></div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.bookingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.vehicle?.brand} {booking.vehicle?.model}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.driver?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{booking.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
