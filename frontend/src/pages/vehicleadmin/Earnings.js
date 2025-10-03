import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    pending: 0
  });
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('completed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        API.get('/bookings'),
        API.get('/bookings/stats')
      ]);

      const allBookings = bookingsRes.data.data;
      setBookings(allBookings);

      const completedBookings = allBookings.filter(b => b.status === 'completed');
      const pendingBookings = allBookings.filter(b => b.status === 'confirmed' || b.status === 'ongoing');
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthEarnings = completedBookings
        .filter(b => {
          const bookingDate = new Date(b.createdAt);
          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
        })
        .reduce((sum, b) => sum + b.totalAmount, 0);

      const lastMonthEarnings = completedBookings
        .filter(b => {
          const bookingDate = new Date(b.createdAt);
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear;
        })
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setEarnings({
        total: completedBookings.reduce((sum, b) => sum + b.totalAmount, 0),
        thisMonth: thisMonthEarnings,
        lastMonth: lastMonthEarnings,
        pending: pendingBookings.reduce((sum, b) => sum + b.totalAmount, 0)
      });
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
    setLoading(false);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.location.href = '/vehicleadmin/dashboard'}
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">Earnings Report</h2>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-green-600">₹{earnings.total}</h3>
          <p className="text-gray-600">Total Earnings</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-blue-600">₹{earnings.thisMonth}</h3>
          <p className="text-gray-600">This Month</p>
          <p className="text-sm text-gray-500 mt-1">
            {earnings.lastMonth > 0 
              ? `${earnings.thisMonth > earnings.lastMonth ? '+' : ''}${Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100)}% vs last month`
              : 'First month'
            }
          </p>
        </div>
        
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-purple-600">₹{earnings.lastMonth}</h3>
          <p className="text-gray-600">Last Month</p>
          <p className="text-sm text-gray-500 mt-1">Previous period</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-orange-600">₹{earnings.pending}</h3>
          <p className="text-gray-600">Pending Earnings</p>
          <p className="text-sm text-gray-500 mt-1">From active bookings</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded shadow">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Booking History</h3>
          <select
            className="p-2 border rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div>
                    <div className="text-sm text-gray-500">{booking.bookingType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.vehicle?.brand} {booking.vehicle?.model}
                    </div>
                    <div className="text-sm text-gray-500">{booking.vehicle?.registrationNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.driver?.name}</div>
                    <div className="text-sm text-gray-500">{booking.driver?.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.duration} {booking.bookingType === 'hourly' ? 'hours' : 'days'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">₹{booking.totalAmount}</div>
                    <div className="text-sm text-gray-500">
                      Base: ₹{booking.baseAmount} + Tax: ₹{booking.taxes}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                    <div className="text-gray-500">{booking.startTime}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="mt-8 bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Average per booking</p>
            <p className="text-xl font-bold text-blue-600">
              ₹{bookings.filter(b => b.status === 'completed').length > 0 
                ? Math.round(earnings.total / bookings.filter(b => b.status === 'completed').length)
                : 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Completed bookings</p>
            <p className="text-xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'completed').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Success rate</p>
            <p className="text-xl font-bold text-purple-600">
              {bookings.length > 0 
                ? Math.round((bookings.filter(b => b.status === 'completed').length / bookings.length) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;