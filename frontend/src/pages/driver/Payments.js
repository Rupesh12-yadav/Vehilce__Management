import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const Payments = () => {
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

      setPayments(paymentsRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
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

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentTypeColor = (type) => {
    const colors = {
      booking: 'bg-blue-100 text-blue-800',
      security: 'bg-purple-100 text-purple-800',
      penalty: 'bg-red-100 text-red-800',
      refund: 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/driver/dashboard'}
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">Payment History</h2>
        </div>
        
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Payments</option>
          <option value="success">Successful</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-blue-600">₹{stats.totalAmount || 0}</h3>
          <p className="text-gray-600">Total Paid</p>
          <p className="text-sm text-gray-500 mt-1">{stats.totalPayments || 0} transactions</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-green-600">{stats.successfulPayments || 0}</h3>
          <p className="text-gray-600">Successful</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.totalPayments > 0 
              ? Math.round((stats.successfulPayments / stats.totalPayments) * 100)
              : 0}% success rate
          </p>
        </div>
        
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-yellow-600">
            {payments.filter(p => p.status === 'pending').length}
          </h3>
          <p className="text-gray-600">Pending</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-purple-600">₹{stats.totalRefunds || 0}</h3>
          <p className="text-gray-600">Refunds</p>
          <p className="text-sm text-gray-500 mt-1">Total refunded</p>
        </div>
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No payments found</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {payment.paymentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{payment.booking?.bookingId}</div>
                    <div className="text-gray-500">
                      {new Date(payment.booking?.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{payment.amount}
                    {payment.refundAmount > 0 && (
                      <div className="text-sm text-green-600">
                        Refund: ₹{payment.refundAmount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="capitalize">{payment.paymentMethod}</span>
                    {payment.transactionId && (
                      <div className="text-xs text-gray-500">
                        TXN: {payment.transactionId}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPaymentTypeColor(payment.paymentType)}`}>
                      {payment.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(payment.createdAt).toLocaleDateString()}
                    <div className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => makePayment(payment.booking._id, payment.amount)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Retry Payment
                      </button>
                    )}
                    {payment.status === 'success' && (
                      <button
                        onClick={() => window.open(`/receipt/${payment._id}`, '_blank')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Download Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Methods Info */}
      <div className="mt-8 bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Accepted Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded">
            <div className="text-2xl mb-2">💳</div>
            <p className="font-semibold">Credit/Debit Card</p>
            <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-2xl mb-2">📱</div>
            <p className="font-semibold">UPI</p>
            <p className="text-sm text-gray-600">PhonePe, GPay, Paytm</p>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-2xl mb-2">🏦</div>
            <p className="font-semibold">Net Banking</p>
            <p className="text-sm text-gray-600">All major banks</p>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-2xl mb-2">💵</div>
            <p className="font-semibold">Cash</p>
            <p className="text-sm text-gray-600">Pay at pickup</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;