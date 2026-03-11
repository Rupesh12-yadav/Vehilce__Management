const User = require('../models/User');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: users,
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

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get user statistics
    let stats = {};
    
    if (user.role === 'driver') {
      const bookings = await Booking.find({ driver: user._id });
      stats = {
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        totalSpent: bookings.filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + b.totalAmount, 0)
      };
    } else if (user.role === 'vehicleadmin') {
      const vehicles = await Vehicle.find({ owner: user._id });
      const bookings = await Booking.find({ vehicleOwner: user._id });
      stats = {
        totalVehicles: vehicles.length,
        totalBookings: bookings.length,
        totalEarnings: bookings.filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + b.totalAmount, 0)
      };
    }
    
    res.json({ success: true, data: { ...user.toObject(), stats } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check authorization
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check for active bookings
    const activeBookings = await Booking.find({
      $or: [
        { driver: req.params.id },
        { vehicleOwner: req.params.id }
      ],
      status: { $in: ['pending', 'confirmed', 'ongoing'] }
    });
    
    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active bookings'
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const [userStats, bookingStats, vehicleStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            drivers: { $sum: { $cond: [{ $eq: ['$role', 'driver'] }, 1, 0] } },
            vehicleAdmins: { $sum: { $cond: [{ $eq: ['$role', 'vehicleadmin'] }, 1, 0] } },
            superAdmins: { $sum: { $cond: [{ $eq: ['$role', 'superadmin'] }, 1, 0] } },
            verifiedUsers: { $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] } }
          }
        }
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            completedBookings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            pendingBookings: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$totalAmount', 0] } }
          }
        }
      ]),
      Vehicle.aggregate([
        {
          $group: {
            _id: null,
            totalVehicles: { $sum: 1 },
            availableVehicles: { $sum: { $cond: [{ $eq: ['$availability', true] }, 1, 0] } }
          }
        }
      ])
    ]);
    
    res.json({ 
      success: true, 
      data: {
        ...userStats[0] || {},
        ...bookingStats[0] || {},
        ...vehicleStats[0] || {}
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};