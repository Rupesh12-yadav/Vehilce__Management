const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'vehicleadmin', 'driver'], 
    required: true,
    index: true
  },
  phone: { type: String, required: true, index: true },
  address: { type: String },
  licenseNumber: { type: String, index: true },
  aadharNumber: { type: String },
  profileImage: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  isActive: { type: Boolean, default: true, index: true },
  isVerified: { type: Boolean, default: false, index: true },
  totalEarnings: { type: Number, default: 0 },
  rating: { type: Number, default: 0, index: true },
  totalRides: { type: Number, default: 0 }
}, { timestamps: true });

// Compound indexes
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ role: 1, isVerified: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);