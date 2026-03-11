import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const Payments = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0
  });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        API.get('/payments'),
        API.get('/payments/stats')
      ]);

      const paymentsData = paymentsRes.data.data || paymentsRes.data;
      const statsData = statsRes.data.data || statsRes.data;
      
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setStats(statsData || { total: 0, successful: 0, pending: 0, failed: 0 });
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
    setLoading(false);
  };

  const makePayment = async (bookingId, amount) => {
    const paymentMethod = prompt('Select payment method:\n1. Cash\n2. Card\n3. UPI\n4. Net Banking\nEnter choice (1-4):');
    
    const methods = {
      '1': 'cash',
      '2': 'card', 
      '3': 'upi',
      '4': 'netbanking'
    };

    if (!methods[paymentMethod]) {
      alert('Invalid payment method');
      return;
    }

    try {
      await API.post('/payments', {
        bookingId,
        amount,
        paymentMethod: methods[paymentMethod],
        paymentType: 'booking'
      });
      
      alert('Payment processed successfully!');
      fetchPayments();
    } catch (error) {
      alert('Payment failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      refunded: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPaymentTypeColor = (type) => {
    const colors = {
      booking: 'bg-blue-100 text-blue-700 border-blue-200',
      security: 'bg-purple-100 text-purple-700 border-purple-200',
      penalty: 'bg-red-100 text-red-700 border-red-200',
      refund: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All', color: 'from-gray-400 to-gray-500' },
    { value: 'success', label: 'Success', color: 'from-green-400 to-green-500' },
    { value: 'pending', label: 'Pending', color: 'from-yellow-400 to-yellow-500' },
    { value: 'failed', label: 'Failed', color: 'from-red-400 to-red-500' },
    { value: 'refunded', label: 'Refunded', color: 'from-blue-400 to-blue-500' }
  ];

  const paymentMethods = [
    { icon: '💳', title: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
    { icon: '📱', title: 'UPI', desc: 'PhonePe, GPay, Paytm' },
    { icon: '🏦', title: 'Net Banking', desc: 'All major banks' },
    { icon: '💵', title: 'Cash', desc: 'Pay at pickup' }
  ];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading payments...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link to="/driver/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white text-lg">🚗</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RentEase
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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
              to="/driver/dashboard" 
              className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-500 mt-1">Track all your payments and transactions</p>
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

        {/* Payment Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmount || 0}</p>
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-xs text-gray-400 mt-1">{stats.totalPayments || 0} transactions</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.successfulPayments || 0}</p>
            <p className="text-sm text-gray-500">Successful</p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.totalPayments > 0 
                ? Math.round((stats.successfulPayments / stats.totalPayments) * 100)
                : 0}% success rate
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xs text-gray-400 mt-1">Awaiting confirmation</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💸</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">₹{stats.totalRefunds || 0}</p>
            <p className="text-sm text-gray-500">Refunds</p>
            <p className="text-xs text-gray-400 mt-1">Total refunded</p>
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Booking</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{payment.paymentId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{payment.booking?.bookingId}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.booking?.startDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">₹{payment.amount}</span>
                        {payment.refundAmount > 0 && (
                          <div className="text-xs text-green-600">Refund: ₹{payment.refundAmount}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 capitalize">{payment.paymentMethod}</span>
                        {payment.transactionId && (
                          <div className="text-xs text-gray-500">TXN: {payment.transactionId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${getPaymentTypeColor(payment.paymentType)}`}>
                          {payment.paymentType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</span>
                        <div className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => makePayment(payment.booking?._id, payment.amount)}
                            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                          >
                            Retry Payment
                          </button>
                        )}
                        {payment.status === 'success' && (
                          <button
                            onClick={() => window.open(`/receipt/${payment._id}`, '_blank')}
                            className="text-green-600 hover:text-green-900 font-medium text-sm flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Methods Info */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Payment Methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map((method, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl text-center hover:bg-gray-100 transition-colors">
                <div className="text-3xl mb-2">{method.icon}</div>
                <p className="font-semibold text-gray-900">{method.title}</p>
                <p className="text-sm text-gray-500">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;


