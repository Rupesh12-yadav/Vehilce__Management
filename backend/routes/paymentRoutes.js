const express = require('express');
const { 
  createPayment, 
  getPayments, 
  updatePaymentStatus,
  processRefund,
  getPaymentStats
} = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

// Payment routes
router.post('/', auth, createPayment);
router.get('/', auth, getPayments);
router.get('/stats', auth, getPaymentStats);
router.put('/:id/status', auth, updatePaymentStatus);

// Admin routes
router.post('/:id/refund', auth, checkRole(['vehicleadmin', 'superadmin']), processRefund);

module.exports = router;