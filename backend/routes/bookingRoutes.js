const express = require('express');
const { 
  createBooking, 
  getBookings, 
  getMyBookings, 
  getBookingById,
  updateBookingStatus,
  startTrip,
  endTrip,
  getBookingStats
} = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

// Driver routes
router.post('/', auth, checkRole(['driver']), createBooking);
router.get('/my', auth, checkRole(['driver']), getMyBookings);
router.post('/:id/start', auth, checkRole(['driver']), startTrip);
router.post('/:id/end', auth, checkRole(['driver']), endTrip);

// Common routes
router.get('/', auth, getBookings);
router.get('/stats', auth, getBookingStats);
router.get('/:id', auth, getBookingById);

// Admin routes
router.put('/:id/status', auth, checkRole(['vehicleadmin', 'superadmin']), updateBookingStatus);

// Driver routes - cancel booking
router.put('/:id/cancel', auth, checkRole(['driver']), async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if the driver owns this booking
    if (booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }
    
    // Only allow cancellation of pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending bookings can be cancelled' });
    }
    
    booking.status = 'cancelled';
    if (reason) booking.cancellationReason = reason;
    
    // Update vehicle availability
    await Vehicle.findByIdAndUpdate(booking.vehicle, { availability: true });
    
    await booking.save();
    
    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;