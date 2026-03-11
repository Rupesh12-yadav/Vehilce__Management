import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vehicleAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const SearchVehicles = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  
  // Filter states
  const [searchName, setSearchName] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: '',
    sortBy: 'price-low',
    seatingCapacity: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters, searchName]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleAPI.getAllVehicles({ availability: true });
      const vehiclesData = response.data.data || response.data;
      const vehiclesList = Array.isArray(vehiclesData) ? vehiclesData : [];
      setVehicles(vehiclesList);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...vehicles];

    if (searchName) {
      const search = searchName.toLowerCase();
      result = result.filter(v => 
        v.name?.toLowerCase().includes(search) ||
        v.brand?.toLowerCase().includes(search) ||
        v.model?.toLowerCase().includes(search) ||
        v.registrationNumber?.toLowerCase().includes(search)
      );
    }

    if (filters.type) {
      result = result.filter(v => v.type === filters.type);
    }

    if (filters.city) {
      const cityFilter = filters.city.toLowerCase();
      result = result.filter(v => 
        v.city?.toLowerCase().includes(cityFilter) ||
        v.location?.city?.toLowerCase().includes(cityFilter)
      );
    }

    if (filters.minPrice) {
      result = result.filter(v => v.pricePerDay >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(v => v.pricePerDay <= Number(filters.maxPrice));
    }

    if (filters.fuelType) {
      result = result.filter(v => v.fuelType === filters.fuelType);
    }

    if (filters.transmission) {
      result = result.filter(v => v.transmission === filters.transmission);
    }

    if (filters.seatingCapacity) {
      result = result.filter(v => v.seatingCapacity >= Number(filters.seatingCapacity));
    }

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
        break;
      case 'name-az':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-za':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        break;
    }

    setFilteredVehicles(result);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      sortBy: 'price-low',
      seatingCapacity: ''
    });
    setSearchName('');
  };

  // Fetch city suggestions for autocomplete
  const fetchCitySuggestions = async (query) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }
    try {
      const response = await vehicleAPI.getCities(query);
      setCitySuggestions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setCitySuggestions([]);
    }
  };

  // Handle city input change
  const handleCityChange = (e) => {
    const value = e.target.value;
    setFilters({...filters, city: value});
    setShowCitySuggestions(true);
    fetchCitySuggestions(value);
  };

  // Select city from suggestions
  const selectCity = (city) => {
    setFilters({...filters, city});
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  const handleBooking = (vehicleId) => {
    navigate(`/driver/book/${vehicleId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Vehicle</h1>
          <p className="text-blue-100">Browse and book from a wide range of vehicles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search by Name */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, brand, model..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            
            {/* Quick Filter - Type */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Vehicle Types</option>
              <option value="car">🚗 Car</option>
              <option value="bike">🏍️ Bike</option>
              <option value="truck">🚛 Truck</option>
              <option value="bus">🚌 Bus</option>
              <option value="auto">🚕 Auto</option>
            </select>

            {/* Sort */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            >
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="name-az">🔤 Name: A to Z</option>
              <option value="name-za">🔠 Name: Z to A</option>
            </select>

            {/* Toggle Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showFilters ? 'Hide' : 'More'} Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* City */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.city}
                    onChange={handleCityChange}
                    onFocus={() => setShowCitySuggestions(true)}
                  />
                  {/* City Suggestions Dropdown */}
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {citySuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
                          onClick={() => selectCity(city)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹/day)</label>
                  <input
                    type="number"
                    placeholder="Min price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹/day)</label>
                  <input
                    type="number"
                    placeholder="Max price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.fuelType}
                    onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
                  >
                    <option value="">All Fuel Types</option>
                    <option value="petrol">⛽ Petrol</option>
                    <option value="diesel">🛢️ Diesel</option>
                    <option value="electric">⚡ Electric</option>
                    <option value="cng">🔋 CNG</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.transmission}
                    onChange={(e) => setFilters({...filters, transmission: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="manual">🔧 Manual</option>
                    <option value="automatic">🤖 Automatic</option>
                  </select>
                </div>

                {/* Seating Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Seats</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.seatingCapacity}
                    onChange={(e) => setFilters({...filters, seatingCapacity: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="2">2+ Seats</option>
                    <option value="4">4+ Seats</option>
                    <option value="5">5+ Seats</option>
                    <option value="7">7+ Seats</option>
                    <option value="10">10+ Seats</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-800">{filteredVehicles.length}</span> vehicles
          </p>
        </div>

        {/* Vehicle List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No vehicles found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle._id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                onClick={() => handleBooking(vehicle._id)}
              >
                {/* Vehicle Image */}
                <div className="relative h-52 bg-gray-100">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img 
                      src={vehicle.images[0]} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    {vehicle.availability ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                        Not Available
                      </span>
                    )}
                  </div>

                  {/* Vehicle Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 text-gray-700 text-xs font-semibold rounded-full shadow">
                      {vehicle.type?.charAt(0).toUpperCase() + vehicle.type?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-gray-500 text-sm">{vehicle.name}</p>
                  
                  <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {vehicle.transmission}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {vehicle.seatingCapacity} seats
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vehicle.location?.city || vehicle.city || 'N/A'}, {vehicle.state || ''}
                  </div>

                  {/* Price & Book Button */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-green-600">₹{vehicle.pricePerDay}</span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBooking(vehicle._id);
                      }}
                      disabled={!vehicle.availability}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        vehicle.availability 
                          ? 'bg-blue-500 text-white hover:bg-blue-600' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {vehicle.availability ? 'Book Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchVehicles;


