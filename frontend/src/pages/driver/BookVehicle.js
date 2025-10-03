import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/api';

const BookVehicle = () => {
  const { vehicleId } = useParams();
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
      setVehicle(response.data.data);
    } catch (error) {
      alert('Vehicle not found');
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

      await API.post('/bookings', {
        vehicle: vehicleId,
        ...bookingData,
        duration,
        amount: priceDetails.total
      });

      alert('Booking created successfully!');
      window.location.href = '/driver/bookings';
    } catch (error) {
      alert(
        'Booking failed: ' +
          (error.response?.data?.message || 'Unknown error')
      );
    }
  };

  if (!vehicle) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book Vehicle</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Details */}
        <div className="bg-white rounded shadow p-6">
          <img
            src={vehicle.images?.[0] || '/placeholder-car.jpg'}
            alt={vehicle.name}
            className="w-full h-48 object-cover rounded mb-4"
          />
          <h3 className="text-xl font-bold">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-gray-600">
            {vehicle.type} • {vehicle.year}
          </p>
          <p className="text-gray-600">
            {vehicle.fuelType} • {vehicle.transmission}
          </p>
          <p className="text-gray-600">Seats: {vehicle.seatingCapacity}</p>
         <p className="text-gray-600">{vehicle.location?.city || "City not available"}</p>


          <div className="mt-4">
            <p className="text-lg font-bold text-green-600">
              ₹{vehicle.pricePerDay}/day
            </p>
            <p className="text-sm text-gray-600">
              ₹{vehicle.pricePerHour}/hour
            </p>
          </div>

          {vehicle.features && (
            <div className="mt-4">
              <p className="font-semibold">Features:</p>
              <p className="text-sm text-gray-600">
                {vehicle.features.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded shadow p-6">
          <form onSubmit={handleBooking} className="space-y-4">
            {/* Booking Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Booking Type
              </label>
              <select
                className="w-full p-2 border rounded"
                value={bookingData.bookingType}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    bookingType: e.target.value
                  })
                }
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
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
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
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
                  <label className="block text-sm font-medium mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded"
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
                  <label className="block text-sm font-medium mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded"
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
              <label className="block text-sm font-medium mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                placeholder="Address"
                className="w-full p-2 border rounded mb-2"
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
                  className="p-2 border rounded"
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
                  className="p-2 border rounded"
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
              <label className="block text-sm font-medium mb-1">
                Drop Location
              </label>
              <input
                type="text"
                placeholder="Address"
                className="w-full p-2 border rounded mb-2"
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
                  className="p-2 border rounded"
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
                  className="p-2 border rounded"
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
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Price Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span>₹{priceDetails.baseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (18%):</span>
                  <span>₹{priceDetails.taxes}</span>
                </div>
                {bookingData.bookingType === 'daily' && (
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span>₹{priceDetails.security}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>₹{priceDetails.total}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 font-semibold"
            >
              Book Now - ₹{priceDetails.total}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookVehicle;
