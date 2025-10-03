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

module.exports = router;