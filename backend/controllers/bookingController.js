const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Generate unique booking ID
const generateBookingId = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.createBooking = async (req, res) => {
  try {
    const { 
      vehicle, startDate, endDate, startTime, endTime, 
      pickupLocation, dropLocation, bookingType, duration 
    } = req.body;
    
    const vehicleDoc = await Vehicle.findById(vehicle).populate('owner');
    if (!vehicleDoc) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
    if (!vehicleDoc.availability) {
      return res.status(400).json({ success: false, message: 'Vehicle not available' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      vehicle,
      status: { $in: ['pending', 'confirmed', 'ongoing'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vehicle already booked for selected dates' 
      });
    }

    // Calculate pricing
    let baseAmount = 0;
    if (bookingType === 'hourly') {
      baseAmount = duration * vehicleDoc.pricePerHour;
    } else {
      baseAmount = duration * vehicleDoc.pricePerDay;
    }
    
    const taxes = Math.round(baseAmount * 0.18); // 18% GST
    const securityDeposit = Math.round(vehicleDoc.pricePerDay * 0.5);
    const totalAmount = baseAmount + taxes + securityDeposit;

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      vehicle,
      driver: req.user._id,
      vehicleOwner: vehicleDoc.owner._id,
      startDate,
      endDate,
      startTime,
      endTime,
      pickupLocation,
      dropLocation,
      bookingType,
      duration,
      baseAmount,
      taxes,
      totalAmount,
      securityDeposit,
      otp: generateOTP()
    });

    // Update vehicle availability
    await Vehicle.findByIdAndUpdate(vehicle, { availability: false });
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle', 'name brand model type images')
      .populate('driver', 'name email phone')
      .populate('vehicleOwner', 'name email phone');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (req.user.role === 'vehicleadmin') {
      filter.vehicleOwner = req.user._id;
    } else if (req.user.role === 'driver') {
      filter.driver = req.user._id;
    }
    
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('vehicle', 'name brand model type images registrationNumber')
      .populate('driver', 'name email phone rating')
      .populate('vehicleOwner', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: bookings,
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

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user._id })
      .populate('vehicle', 'name brand model type images registrationNumber')
      .populate('vehicleOwner', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle')
      .populate('driver', 'name email phone')
      .populate('vehicleOwner', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Authorization check
    if (req.user.role === 'vehicleadmin' && booking.vehicleOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (req.user.role === 'driver' && booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    booking.status = status;
    if (reason) booking.cancellationReason = reason;
    
    // Update vehicle availability
    if (status === 'completed' || status === 'cancelled') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { 
        availability: true,
        $inc: { totalBookings: status === 'completed' ? 1 : 0 }
      });
    }
    
    await booking.save();
    
    const updatedBooking = await Booking.findById(booking._id)
      .populate('vehicle', 'name brand model')
      .populate('driver', 'name email')
      .populate('vehicleOwner', 'name email');
    
    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.startTrip = async (req, res) => {
  try {
    const { otp, startOdometerReading, fuelLevel } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (booking.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    booking.status = 'ongoing';
    booking.startOdometerReading = startOdometerReading;
    booking.fuelLevel.start = fuelLevel;
    
    await booking.save();
    
    res.json({ success: true, message: 'Trip started successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.endTrip = async (req, res) => {
  try {
    const { endOdometerReading, fuelLevel, extraCharges } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    booking.status = 'completed';
    booking.endOdometerReading = endOdometerReading;
    booking.fuelLevel.end = fuelLevel;
    if (extraCharges) booking.extraCharges = extraCharges;
    
    await booking.save();
    
    // Update vehicle availability
    await Vehicle.findByIdAndUpdate(booking.vehicle, { 
      availability: true,
      $inc: { totalBookings: 1 }
    });
    
    res.json({ success: true, message: 'Trip completed successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    let matchFilter = {};
    
    if (req.user.role === 'vehicleadmin') {
      matchFilter.vehicleOwner = req.user._id;
    } else if (req.user.role === 'driver') {
      matchFilter.driver = req.user._id;
    }
    
    const stats = await Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalEarnings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$totalAmount', 0] }
          },
          avgBookingValue: { $avg: '$totalAmount' }
        }
      }
    ]);
    
    res.json({ success: true, data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};