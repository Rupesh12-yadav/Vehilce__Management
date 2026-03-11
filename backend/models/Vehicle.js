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
  availability: { type: Boolean, default: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  images: { type: [String], default: [] },
  features: { type: [String], default: [] },
  location: {
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    address: { type: String }
  },
  city: { type: String, required: true, index: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 0, index: true },
  totalBookings: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false, index: true },
  condition: { type: String, default: 'good' }
}, { timestamps: true });

// Compound indexes for common queries
vehicleSchema.index({ availability: 1, type: 1 });
vehicleSchema.index({ availability: 1, city: 1 });
vehicleSchema.index({ availability: 1, pricePerDay: 1 });
vehicleSchema.index({ type: 1, city: 1, availability: 1 });
vehicleSchema.index({ owner: 1, availability: 1 });
vehicleSchema.index({ brand: 1, model: 1 });
vehicleSchema.index({ createdAt: -1 });

// Pre-save middleware to sync flat fields with nested location
vehicleSchema.pre('save', function(next) {
  if (this.isModified('city') || this.isModified('state') || 
      this.isModified('pincode') || this.isModified('address')) {
    this.location = {
      city: this.city,
      state: this.state,
      pincode: this.pincode,
      address: this.address
    };
  }
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
