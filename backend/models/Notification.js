const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['booking', 'payment', 'system', 'promotion'], 
    required: true 
  },
  isRead: { type: Boolean, default: false },
  data: { type: Object },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);