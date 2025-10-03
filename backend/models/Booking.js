const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  pickupLocation: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  dropLocation: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  bookingType: { 
    type: String, 
    enum: ['hourly', 'daily', 'weekly', 'monthly'], 
    required: true 
  },
  duration: { type: Number, required: true },
  baseAmount: { type: Number, required: true },
  taxes: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  securityDeposit: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled', 'rejected'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'partial', 'refunded', 'failed'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'netbanking', 'wallet'] 
  },
  otp: { type: String },
  startOdometerReading: { type: Number },
  endOdometerReading: { type: Number },
  fuelLevel: {
    start: { type: Number },
    end: { type: Number }
  },
  driverRating: { type: Number, min: 1, max: 5 },
  vehicleRating: { type: Number, min: 1, max: 5 },
  driverReview: { type: String },
  vehicleReview: { type: String },
  cancellationReason: { type: String },
  extraCharges: [{
    type: { type: String },
    amount: { type: Number },
    description: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);