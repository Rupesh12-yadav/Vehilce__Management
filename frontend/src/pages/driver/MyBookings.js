import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await API.get('/bookings/my');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoading(false);
  };

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await API.put(`/bookings/${bookingId}/status`, {
          status: 'cancelled',
          reason: 'Cancelled by user'
        });
        alert('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        alert('Error cancelling booking');
      }
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
        <h2 className="text-2xl font-bold">My Bookings</h2>
        
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
          <a href="/driver/search" className="text-blue-500 hover:underline">
            Search for vehicles to book
          </a>
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
                  <p className="text-gray-600">{booking.vehicle.type} • {booking.vehicle.registrationNumber}</p>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Pickup Date & Time</p>
                  <p className="font-semibold">
                    {new Date(booking.startDate).toLocaleDateString()} at {booking.startTime}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.pickupLocation.address}, {booking.pickupLocation.city}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Drop Date & Time</p>
                  <p className="font-semibold">
                    {new Date(booking.endDate).toLocaleDateString()} at {booking.endTime}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.dropLocation.address}, {booking.dropLocation.city}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{booking.totalAmount}</p>
                  <p className="text-sm text-gray-600">
                    Payment: {booking.paymentStatus}
                  </p>
                </div>

                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600">OTP for pickup:</p>
                      <p className="text-lg font-bold text-blue-600">{booking.otp}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => window.location.href = `/booking/${booking._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {booking.status === 'completed' && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Trip completed successfully!</p>
                  {!booking.driverRating && (
                    <button className="text-blue-500 hover:underline text-sm">
                      Rate this trip
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;