import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await API.get('/bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status });
      alert(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      alert('Error updating booking status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vehicle Bookings</h2>
        
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">
                    {booking.vehicle.brand} {booking.vehicle.model}
                  </h3>
                  <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
                  <p className="text-gray-600">
                    Driver: {booking.driver.name} ({booking.driver.phone})
                  </p>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Booking Period</p>
                  <p className="font-semibold">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-semibold">
                    {booking.pickupLocation.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.pickupLocation.address}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{booking.totalAmount}</p>
                  <p className="text-sm text-gray-600">
                    Payment: {booking.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>Booking Type: {booking.bookingType}</p>
                  <p>Duration: {booking.duration} {booking.bookingType === 'hourly' ? 'hours' : 'days'}</p>
                </div>

                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'rejected')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'ongoing' && (
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'completed')}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Complete Trip
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.location.href = `/booking/${booking._id}`}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {booking.otp && booking.status === 'confirmed' && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Share this OTP with driver for pickup: 
                    <span className="font-bold text-blue-600 ml-2">{booking.otp}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;