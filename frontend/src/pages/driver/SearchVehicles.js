import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const SearchVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await API.get('/vehicles', { params: filters });
      // Ensure vehicles is always an array
      setVehicles(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchVehicles();
  };

  const handleBooking = (vehicleId) => {
    window.location.href = `/driver/book/${vehicleId}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Search Vehicles</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="p-2 border rounded"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
            <option value="bus">Bus</option>
          </select>

          <input
            type="text"
            placeholder="City"
            className="p-2 border rounded"
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          />

          <input
            type="number"
            placeholder="Min Price"
            className="p-2 border rounded"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          />

          <input
            type="number"
            placeholder="Max Price"
            className="p-2 border rounded"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          />
        </div>

        <button
          onClick={handleSearch}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Vehicle List */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded shadow p-4">
             <img src={vehicle.images[0]} alt={vehicle.name}
                className="w-80 h-60 object-cover rounded mb-2" />

              <h3 className="text-lg font-bold">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-gray-600">{vehicle.type} • {vehicle.year}</p>
              <p className="text-gray-600">{vehicle.fuelType} • {vehicle.transmission}</p>
              <p className="text-gray-600">Seats: {vehicle.seatingCapacity}</p>
              <p className="text-gray-600">{vehicle.location?.city || 'N/A'}</p>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-green-600">₹{vehicle.pricePerDay}/day</p>
                  <p className="text-sm text-gray-600">₹{vehicle.pricePerHour}/hour</p>
                </div>

                <button
                  onClick={() => handleBooking(vehicle._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={!vehicle.availability}
                >
                  {vehicle.availability ? 'Book Now' : 'Not Available'}
                </button>
              </div>

              {vehicle.features && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Features: {vehicle.features.join(', ')}
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

export default SearchVehicles;
