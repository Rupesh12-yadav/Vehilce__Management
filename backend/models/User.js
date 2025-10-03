const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'vehicleadmin', 'driver'], 
    required: true 
  },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  licenseNumber: { type: String },
  aadharNumber: { type: String },
  profileImage: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  totalEarnings: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalRides: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);