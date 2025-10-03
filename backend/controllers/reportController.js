const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

exports.getEarningsReport = async (req, res) => {
  try {
    const earnings = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalEarnings: { $sum: '$totalAmount' } } }
    ]);
    res.json(earnings[0] || { totalEarnings: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};