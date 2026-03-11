import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const Earnings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

      const allBookings = bookingsRes.data.data || bookingsRes.data || [];
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
      setBookings([]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      ongoing: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const filterOptions = [
    { value: 'all', label: 'All', color: 'from-gray-400 to-gray-500' },
    { value: 'completed', label: 'Completed', color: 'from-green-400 to-green-500' },
    { value: 'ongoing', label: 'Ongoing', color: 'from-blue-400 to-blue-500' },
    { value: 'confirmed', label: 'Confirmed', color: 'from-purple-400 to-purple-500' },
    { value: 'pending', label: 'Pending', color: 'from-yellow-400 to-yellow-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'from-red-400 to-red-500' }
  ];

  const statsCards = [
    { label: 'Total Earnings', value: `₹${earnings.total}`, icon: '💰', color: 'from-green-400 to-green-600', subtext: 'All time' },
    { label: 'This Month', value: `₹${earnings.thisMonth}`, icon: '📅', color: 'from-blue-400 to-blue-600', subtext: earnings.lastMonth > 0 ? `${earnings.thisMonth > earnings.lastMonth ? '+' : ''}${Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100)}% vs last month` : 'First month' },
    { label: 'Last Month', value: `₹${earnings.lastMonth}`, icon: '📊', color: 'from-purple-400 to-purple-600', subtext: 'Previous period' },
    { label: 'Pending', value: `₹${earnings.pending}`, icon: '⏳', color: 'from-orange-400 to-orange-600', subtext: 'From active bookings' }
  ];

  const monthlyStats = [
    { label: 'Average per booking', value: `₹${bookings.filter(b => b.status === 'completed').length > 0 ? Math.round(earnings.total / bookings.filter(b => b.status === 'completed').length) : 0}`, icon: '📈' },
    { label: 'Completed bookings', value: bookings.filter(b => b.status === 'completed').length, icon: '✅' },
    { label: 'Success rate', value: `${bookings.length > 0 ? Math.round((bookings.filter(b => b.status === 'completed').length / bookings.length) * 100) : 0}%`, icon: '🎯' }
  ];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading earnings...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link to="/vehicleadmin/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-white text-lg">🚗</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  RentEase Admin
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/vehicleadmin/dashboard" 
              className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Earnings Report</h1>
              <p className="text-gray-500 mt-1">Track your revenue and earnings</p>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === option.value
                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} opacity-10`}></div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Booking</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div>
                        <div className="text-xs text-gray-500">{booking.bookingType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.vehicle?.brand} {booking.vehicle?.model}
                        </div>
                        <div className="text-xs text-gray-500">{booking.vehicle?.registrationNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.driver?.name}</div>
                        <div className="text-xs text-gray-500">{booking.driver?.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.duration} {booking.bookingType === 'hourly' ? 'hours' : 'days'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">₹{booking.totalAmount}</div>
                        <div className="text-xs text-gray-500">
                          Base: ₹{booking.baseAmount} + Tax: ₹{booking.taxes}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(booking.status)}`}>
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
          )}
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyStats.map((stat, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;


