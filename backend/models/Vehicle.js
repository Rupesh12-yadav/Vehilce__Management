const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['car', 'bike', 'truck', 'bus', 'auto'], 
    required: true 
  },
  year: { type: Number, required: true },
  registrationNumber: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  fuelType: { type: String, required: true },
  seatingCapacity: { type: Number, required: true },
  transmission: { type: String, required: true },
  availability: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: { type: [String], default: [] },
  features: { type: [String], default: [] },
  // Location fields alag-alag
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  condition: { type: String, default: 'good' }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
