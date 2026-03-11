import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const BookVehicle = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    bookingType: 'daily',
    pickupLocation: {
      address: '',
      city: '',
      pincode: ''
    },
    dropLocation: {
      address: '',
      city: '',
      pincode: ''
    }
  });

  // price details
  const [priceDetails, setPriceDetails] = useState({
    baseAmount: 0,
    taxes: 0,
    security: 0,
    total: 0
  });

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  useEffect(() => {
    calculateAmount();
  }, [bookingData, vehicle]);

  const fetchVehicle = async () => {
    try {
      const response = await API.get(`/vehicles/${vehicleId}`);
      const vehicleData = response.data.data || response.data;
      setVehicle(vehicleData);
    } catch (error) {
      alert('Vehicle not found');
      navigate('/driver/search');
    }
  };

  const calculateAmount = () => {
    if (!vehicle || !bookingData.startDate || !bookingData.endDate) return;

    let baseAmount = 0;
    let taxes = 0;
    let security = 0;

    if (bookingData.bookingType === 'daily') {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      );
      baseAmount = days * vehicle.pricePerDay;
      taxes = Math.round(baseAmount * 0.18);
      security = Math.round(vehicle.pricePerDay * 0.5);
    } else {
      const startTime = new Date(`2000-01-01T${bookingData.startTime}`);
      const endTime = new Date(`2000-01-01T${bookingData.endTime}`);
      const hours = Math.max(
        1,
        Math.ceil((endTime - startTime) / (1000 * 60 * 60))
      );
      baseAmount = hours * vehicle.pricePerHour;
      taxes = Math.round(baseAmount * 0.18);
    }

    const total = baseAmount + taxes + security;
    setPriceDetails({ baseAmount, taxes, security, total });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const duration =
        bookingData.bookingType === 'daily'
          ? Math.ceil(
              (new Date(bookingData.endDate) -
                new Date(bookingData.startDate)) /
                (1000 * 60 * 60 * 24)
            )
          : Math.ceil(
              (new Date(`2000-01-01T${bookingData.endTime}`) -
                new Date(`2000-01-01T${bookingData.startTime}`)) /
                (1000 * 60 * 60)
            );

      const response = await API.post('/bookings', {
        vehicle: vehicleId,
        ...bookingData,
        duration,
        amount: priceDetails.total
      });

      if (response.data.success) {
        alert('Booking created successfully!');
        navigate('/driver/bookings');
      }
    } catch (error) {
      alert(
        'Booking failed: ' +
          (error.response?.data?.message || error.response?.data || 'Unknown error')
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!vehicle) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading vehicle...</p>
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
              <Link to="/driver/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link to="/driver/bookings" className="text-gray-600 hover:text-gray-900 font-medium">
                My Bookings
              </Link>
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

      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/driver/search')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-64 bg-gray-100">
              {vehicle.images && vehicle.images.length > 0 ? (
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-gray-500 mt-1">
                {vehicle.type} • {vehicle.year}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{vehicle.fuelType}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-semibold text-gray-900 capitalize">{vehicle.transmission}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-500">Seating</p>
                  <p className="font-semibold text-gray-900">{vehicle.seatingCapacity} seats</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">{vehicle.location?.city || vehicle.city || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">₹{vehicle.pricePerDay}</span>
                  <span className="text-gray-500">/day</span>
                </div>
                <p className="text-sm text-gray-500">
                  ₹{vehicle.pricePerHour}/hour
                </p>
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-900 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Book Your Vehicle</h3>
            <form onSubmit={handleBooking} className="space-y-4">
              {/* Booking Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingData({...bookingData, bookingType: 'hourly'})}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      bookingData.bookingType === 'hourly'
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-lg mb-1">⏰</span>
                    <span className="font-medium">Hourly</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingData({...bookingData, bookingType: 'daily'})}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      bookingData.bookingType === 'daily'
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-lg mb-1">📅</span>
                    <span className="font-medium">Daily</span>
                  </button>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.startDate}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        startDate: e.target.value
                      })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.endDate}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        endDate: e.target.value
                      })
                    }
                    min={bookingData.startDate}
                    required
                  />
                </div>
              </div>

              {/* Times if hourly */}
              {bookingData.bookingType === 'hourly' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={bookingData.startTime}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          startTime: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={bookingData.endTime}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          endTime: e.target.value
                        })
                      }
                      required
                    />
                  </div>
                </div>
              )}

              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Pickup Location
                </label>
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full p-3 border border-gray-200 rounded-xl mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bookingData.pickupLocation.address}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      pickupLocation: {
                        ...bookingData.pickupLocation,
                        address: e.target.value
                      }
                    })
                  }
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.pickupLocation.city}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        pickupLocation: {
                          ...bookingData.pickupLocation,
                          city: e.target.value
                        }
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.pickupLocation.pincode}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        pickupLocation: {
                          ...bookingData.pickupLocation,
                          pincode: e.target.value
                        }
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Drop Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Drop Location
                </label>
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full p-3 border border-gray-200 rounded-xl mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bookingData.dropLocation.address}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      dropLocation: {
                        ...bookingData.dropLocation,
                        address: e.target.value
                      }
                    })
                  }
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.dropLocation.city}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        dropLocation: {
                          ...bookingData.dropLocation,
                          city: e.target.value
                        }
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.dropLocation.pincode}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        dropLocation: {
                          ...bookingData.dropLocation,
                          pincode: e.target.value
                        }
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-5 rounded-2xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">💰 Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Amount:</span>
                    <span className="font-medium text-gray-900">₹{priceDetails.baseAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes (18%):</span>
                    <span className="font-medium text-gray-900">₹{priceDetails.taxes}</span>
                  </div>
                  {bookingData.bookingType === 'daily' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-medium text-gray-900">₹{priceDetails.security}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-green-600">₹{priceDetails.total}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>🎉</span>
                Book Now - ₹{priceDetails.total}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookVehicle;


