const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createPaymentOrder, verifyPaymentSignature, getPaymentDetails, refundPayment } = require('../config/razorpay');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const receipt = bookingId ? `booking_${bookingId}` : `receipt_${Date.now()}`;
    const order = await createPaymentOrder(amount, 'INR', receipt);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// Verify payment and save
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amount } = req.body;

    // Verify signature
    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Get payment details from Razorpay
    const paymentDetails = await getPaymentDetails(razorpay_payment_id);

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      transactionId: razorpay_payment_id,
      paymentMethod: paymentDetails.method,
      paymentStatus: 'success',
      paymentType: 'booking'
    });

    // Update booking payment status
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentMethod: paymentDetails.method
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: payment
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// Get payment statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const matchFilter = {};
    
    if (req.user.role === 'vehicleadmin') {
      const bookings = await Booking.find({ vehicleOwner: req.user._id });
      const bookingIds = bookings.map(b => b._id);
      matchFilter.booking = { $in: bookingIds };
    } else if (req.user.role === 'driver') {
      matchFilter.user = req.user._id;
    }

    const stats = await Payment.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalPayments: { $sum: 1 },
          successfulPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'success'] }, 1, 0] }
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] }
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
          },
          totalRefunds: {
            $sum: { $ifNull: ['$refundAmount', 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalAmount: 0,
        totalPayments: 0,
        successfulPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        totalRefunds: 0
      }
    });
  } catch (error) {
    console.error('Payment stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payment stats' });
  }
});

// Get payment status
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email phone');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payment' });
  }
});

// Process refund
router.post('/refund', auth, async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.paymentStatus !== 'success') {
      return res.status(400).json({ success: false, message: 'Payment not eligible for refund' });
    }

    // Process refund via Razorpay
    const refund = await refundPayment(payment.paymentId, amount || payment.amount);

    // Update payment record
    payment.paymentStatus = 'refunded';
    payment.refundAmount = amount || payment.amount;
    payment.refundReason = reason;
    await payment.save();

    // Update booking
    if (payment.booking) {
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: 'refunded'
      });
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: refund
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ success: false, message: 'Refund processing failed' });
  }
});

// Get user's payment history
router.get('/user/payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payments' });
  }
});

module.exports = router;
