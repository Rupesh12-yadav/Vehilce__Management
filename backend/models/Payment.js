const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true, required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'netbanking', 'wallet', 'razorpay'], 
    required: true 
  },
  paymentType: { 
    type: String, 
    enum: ['booking', 'security', 'penalty', 'refund'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'refunded'], 
    default: 'pending' 
  },
  transactionId: { type: String },
  gatewayResponse: { type: Object },
  refundAmount: { type: Number, default: 0 },
  refundReason: { type: String },
  paidAt: { type: Date },
  refundedAt: { type: Date },
  failureReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);