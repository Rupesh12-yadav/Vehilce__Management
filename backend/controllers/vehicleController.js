const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

exports.createVehicle = async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      owner: req.user._id,
      // Ensure nested location is set from flat fields
      location: {
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        address: req.body.address
      }
    };
    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const { type, city, minPrice, maxPrice, availability, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    // Support both nested location.city and flat city field
    if (city) {
      filter.$or = [
        { 'location.city': new RegExp(city, 'i') },
        { city: new RegExp(city, 'i') }
      ];
    }
    if (availability !== undefined) filter.availability = availability === 'true';
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(filter)
      .populate('owner', 'name email phone rating')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Vehicle.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: vehicles, 
      pagination: { 
        current: page, 
        pages: Math.ceil(total / limit), 
        total 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name email phone rating totalRides');
    
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
    if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: updatedVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
    if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Check for active bookings
    const activeBookings = await Booking.find({
      vehicle: req.params.id,
      status: { $in: ['pending', 'confirmed', 'ongoing'] }
    });
    
    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete vehicle with active bookings' 
      });
    }
    
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    vehicle.availability = !vehicle.availability;
    await vehicle.save();
    
    res.json({ 
      success: true, 
      message: `Vehicle ${vehicle.availability ? 'enabled' : 'disabled'} successfully`,
      data: vehicle 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVehicleStats = async (req, res) => {
  try {
    // Get start of current month in UTC for consistent timezone handling
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    
    const [vehicleStats, bookingStats] = await Promise.all([
      Vehicle.aggregate([
        { $match: { owner: req.user._id } },
        {
          $group: {
            _id: null,
            totalVehicles: { $sum: 1 },
            availableVehicles: { $sum: { $cond: [{ $eq: ['$availability', true] }, 1, 0] } },
            unavailableVehicles: { $sum: { $cond: [{ $eq: ['$availability', false] }, 1, 0] } },
            totalBookings: { $sum: '$totalBookings' },
            avgRating: { $avg: '$rating' }
          }
        }
      ]),
      Booking.aggregate([
        { $match: { vehicleOwner: req.user._id } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            pendingBookings: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            confirmedBookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
            completedBookings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            totalEarnings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$totalAmount', 0] } },
            monthlyEarnings: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'completed'] }, { $gte: ['$createdAt', startOfMonth] }] }, '$totalAmount', 0] } }
          }
        }
      ])
    ]);
    
    res.json({ 
      success: true, 
      data: {
        ...vehicleStats[0] || {},
        ...bookingStats[0] || {}
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unique cities for autocomplete
exports.getCities = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Get unique cities from vehicles
    const cities = await Vehicle.aggregate([
      {
        $match: {
          availability: true,
          $or: [
            { city: { $regex: search || '', $options: 'i' } },
            { 'location.city': { $regex: search || '', $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          cities: {
            $addToSet: {
              $cond: [
                { $ne: ['$city', null] },
                '$city',
                '$location.city'
              ]
            }
          }
        }
      },
      {
        $unwind: '$cities'
      },
      {
        $match: {
          cities: { $ne: null, $ne: '' }
        }
      },
      {
        $sort: { cities: 1 }
      },
      {
        $limit: 20
      },
      {
        $project: {
          _id: 0,
          city: '$cities'
        }
      }
    ]);
    
    res.json({ 
      success: true, 
      data: cities.map(c => c.city)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};