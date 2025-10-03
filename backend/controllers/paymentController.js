const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Generate unique payment ID
const generatePaymentId = () => {
  return 'PAY' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, paymentType } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const payment = await Payment.create({
      paymentId: generatePaymentId(),
      booking: bookingId,
      user: req.user._id,
      amount,
      paymentMethod,
      paymentType,
      status: paymentMethod === 'cash' ? 'success' : 'pending'
    });
    
    // Update booking payment status
    if (payment.status === 'success') {
      booking.paymentStatus = 'paid';
      booking.paymentMethod = paymentMethod;
      await booking.save();
    }
    
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = { user: req.user._id };
    if (status) filter.status = status;
    
    const payments = await Payment.find(filter)
      .populate('booking', 'bookingId startDate endDate totalAmount')
      .populate('user', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Payment.countDocuments(filter);
    
    res.json({
      success: true,
      data: payments,
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

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, transactionId, gatewayResponse } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    if (gatewayResponse) payment.gatewayResponse = gatewayResponse;
    
    await payment.save();
    
    // Update booking payment status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.paymentStatus = status === 'success' ? 'paid' : 'failed';
      await booking.save();
    }
    
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processRefund = async (req, res) => {
  try {
    const { refundAmount, refundReason } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    if (payment.status !== 'success') {
      return res.status(400).json({ 
        success: false, 
        message: 'Can only refund successful payments' 
      });
    }
    
    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = refundReason;
    
    await payment.save();
    
    res.json({ success: true, message: 'Refund processed successfully', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentStats = async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          successfulPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          totalAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] }
          },
          totalRefunds: {
            $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, '$refundAmount', 0] }
          }
        }
      }
    ]);
    
    res.json({ success: true, data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};