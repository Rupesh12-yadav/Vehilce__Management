import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { 
  Search, 
  CalendarCheck, 
  CreditCard, 
  User, 
  LogOut,
  Car,
  Clock,
  Wallet,
  Star
} from 'lucide-react';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: <Search className="w-7 h-7" />,
      title: 'Search Vehicles',
      description: 'Find and book your perfect ride',
      link: '/driver/search',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <CalendarCheck className="w-7 h-7" />,
      title: 'My Bookings',
      description: 'View your booking history',
      link: '/driver/bookings',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <CreditCard className="w-7 h-7" />,
      title: 'Payments',
      description: 'View payment history',
      link: '/driver/payments',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <User className="w-7 h-7" />,
      title: 'My Profile',
      description: 'Manage your account',
      link: '/profile',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const stats = [
    { label: 'Total Bookings', value: '0', icon: <CalendarCheck className="w-6 h-6 text-blue-600" />, color: 'text-blue-600' },
    { label: 'Active Bookings', value: '0', icon: <Car className="w-6 h-6 text-green-600" />, color: 'text-green-600' },
    { label: 'Total Spent', value: '₹0', icon: <Wallet className="w-6 h-6 text-purple-600" />, color: 'text-purple-600' },
    { label: 'Days Member', value: '0', icon: <Clock className="w-6 h-6 text-orange-600" />, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.name}!</span>
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gray-100">{stat.icon}</div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item, idx) => (
            <Link 
              key={idx}
              to={item.link}
              className="group bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className={`text-${item.color.split(' ')[1].replace('to-', '')}`}>
                  {item.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium">No recent activity</p>
            <p className="text-sm">Your booking history will appear here</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DriverDashboard;


