import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, bookingAPI, vehicleAPI, complaintAPI, documentAPI } from '../../api/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { 
  Users, 
  Shield, 
  FileCheck, 
  BarChart3, 
  AlertTriangle, 
  User, 
  LogOut,
  Car,
  CheckCircle,
  TrendingUp,
  Clock,
  Star,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await userAPI.getUserStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Manage Users',
      description: 'View & manage all users',
      link: '/superadmin/users',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      stats: { value: stats?.totalUsers || 0, label: 'Total Users' }
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Vehicle Admins',
      description: 'Manage admin accounts',
      link: '/superadmin/admins',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      stats: { value: stats?.vehicleAdmins || 0, label: 'Admins' }
    },
    {
      icon: <FileCheck className="w-7 h-7" />,
      title: 'Document Approval',
      description: 'Review pending documents',
      link: '/superadmin/documents',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      stats: { value: 0, label: 'Pending' }
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'System Reports',
      description: 'View analytics & reports',
      link: '/superadmin/reports',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      stats: { value: stats?.totalBookings || 0, label: 'Bookings' }
    },
    {
      icon: <AlertTriangle className="w-7 h-7" />,
      title: 'Handle Complaints',
      description: 'Resolve user complaints',
      link: '/superadmin/complaints',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      stats: { value: 0, label: 'Open' }
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
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
    { label: 'Vehicle Admins', value: stats?.vehicleAdmins || 0, icon: <Shield className="w-6 h-6" />, color: 'from-purple-400 to-purple-600' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: <BarChart3 className="w-6 h-6" />, color: 'from-green-400 to-green-600' },
    { label: 'Total Vehicles', value: stats?.totalVehicles || 0, icon: <Car className="w-6 h-6" />, color: 'from-orange-400 to-orange-600' },
    { label: 'Active Users', value: stats?.activeUsers || 0, icon: <CheckCircle className="w-6 h-6" />, color: 'from-red-400 to-red-600' }
  ];

  const recentActivity = [
    { icon: <Users className="w-5 h-5 text-blue-600" />, text: 'Total drivers', value: stats?.drivers || 0, color: 'text-blue-600' },
    { icon: <Car className="w-5 h-5 text-green-600" />, text: 'Available vehicles', value: stats?.availableVehicles || 0, color: 'text-green-600' },
    { icon: <CheckCircle className="w-5 h-5 text-purple-600" />, text: 'Completed bookings', value: stats?.completedBookings || 0, color: 'text-purple-600' },
    { icon: <AlertTriangle className="w-5 h-5 text-red-600" />, text: 'Pending bookings', value: stats?.pendingBookings || 0, color: 'text-red-600' }
  ];

  const quickStats = [
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Verified users', value: stats?.verifiedUsers || 0 },
    { icon: <Clock className="w-5 h-5" />, text: 'Super admins', value: stats?.superAdmins || 0 },
    { icon: <Star className="w-5 h-5" />, text: 'Total vehicles', value: stats?.totalVehicles || 0 },
    { icon: <DollarSign className="w-5 h-5" />, text: 'Total revenue', value: `₹${stats?.totalRevenue || 0}` }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.name}!</span>
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your platform today.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statsCards.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {menuItems.map((item, idx) => (
            <Link 
              key={idx}
              to={item.link}
              className="group bg-white p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${item.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{item.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900">{item.stats.value}</span>
                <span className="text-xs text-gray-500">{item.stats.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white">{item.icon}</div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                  <span className={`font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              {quickStats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white">{item.icon}</div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

