import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleAPI, bookingAPI } from '../../api/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { 
  Car, 
  CalendarCheck, 
  DollarSign, 
  User, 
  LogOut,
  Users,
  TrendingUp,
  FileText,
  XCircle
} from 'lucide-react';

const VehicleAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        vehicleAPI.getVehicleStats(),
        bookingAPI.getAllBookings({ limit: 5 })
      ]);
      setStats(statsRes.data.data);
      setRecentBookings(bookingsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: <Car className="w-7 h-7" />,
      title: 'Manage Vehicles',
      description: 'Add, edit & manage your fleet',
      link: '/vehicleadmin/vehicles',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      stats: { value: stats?.totalVehicles || 0, label: 'Vehicles' }
    },
    {
      icon: <CalendarCheck className="w-7 h-7" />,
      title: 'Bookings',
      description: 'View booking requests',
      link: '/vehicleadmin/bookings',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      stats: { value: stats?.pendingBookings || 0, label: 'Pending' }
    },
    {
      icon: <DollarSign className="w-7 h-7" />,
      title: 'Earnings',
      description: 'Revenue & earnings report',
      link: '/vehicleadmin/earnings',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      stats: { value: `₹${stats?.totalEarnings || 0}`, label: 'Total' }
    },
    {
      icon: <User className="w-7 h-7" />,
      title: 'My Profile',
      description: 'Manage your account',
      link: '/profile',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      stats: { value: 'Edit', label: 'Profile' }
    }
  ];

  const statsCards = [
    { label: 'Total Vehicles', value: stats?.totalVehicles || 0, icon: <Car className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
    { label: 'Available', value: stats?.availableVehicles || 0, icon: <CalendarCheck className="w-6 h-6" />, color: 'from-green-400 to-green-600' },
    { label: 'Booked', value: (stats?.totalVehicles || 0) - (stats?.availableVehicles || 0), icon: <Users className="w-6 h-6" />, color: 'from-orange-400 to-orange-600' },
    { label: 'Unavailable', value: stats?.unavailableVehicles || 0, icon: <XCircle className="w-6 h-6" />, color: 'from-red-400 to-red-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{user?.name}!</span>
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your vehicle fleet and bookings.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gray-100">{stat.icon}</div>
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} opacity-10`}></div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {menuItems.map((item, idx) => (
            <Link 
              key={idx}
              to={item.link}
              className="group bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">{item.stats.value}</span>
                <span className="text-sm text-gray-500">{item.stats.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
            <Link to="/vehicleadmin/bookings" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              View All →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium">No recent bookings</p>
              <p className="text-sm">New booking requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{booking.vehicle?.name}</p>
                      <p className="text-sm text-gray-500">{booking.driver?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹{booking.totalAmount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleAdminDashboard;

