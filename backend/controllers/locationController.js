const axios = require('axios');

// Search location using OpenStreetMap Nominatim API
exports.searchLocation = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5
      },
      headers: {
        'User-Agent': 'VehicleRentalApp/1.0'
      }
    });

    const locations = response.data.map(item => ({
      displayName: item.display_name,
      lat: item.lat,
      lon: item.lon,
      city: item.address?.city || item.address?.town || item.address?.village || '',
      state: item.address?.state || '',
      country: item.address?.country || '',
      pincode: item.address?.postcode || ''
    }));

    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get vehicles near a location
exports.getVehiclesByLocation = async (req, res) => {
  try {
    const { lat, lon, radius = 10, type } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const Vehicle = require('../models/Vehicle');
    
    let filter = { availability: true };
    if (type) filter.type = type;

    const vehicles = await Vehicle.find(filter)
      .populate('owner', 'name email phone rating');

    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
