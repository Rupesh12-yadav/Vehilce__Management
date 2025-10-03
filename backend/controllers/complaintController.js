const Complaint = require('../models/Complaint');
const Booking = require('../models/Booking');

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, booking, priority } = req.body;
    
    // Validate booking if provided
    if (booking) {
      const bookingDoc = await Booking.findById(booking);
      if (!bookingDoc) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      
      // Check if user is related to the booking
      if (bookingDoc.driver.toString() !== req.user._id.toString() && 
          bookingDoc.vehicleOwner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized for this booking' });
      }
    }
    
    const complaint = await Complaint.create({
      title,
      description,
      complainant: req.user._id,
      booking,
      priority: priority || 'medium'
    });
    
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('complainant', 'name email phone')
      .populate('booking', 'bookingId startDate endDate');
    
    res.status(201).json({ success: true, data: populatedComplaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    
    // Role-based filtering
    if (req.user.role === 'driver' || req.user.role === 'vehicleadmin') {
      filter.complainant = req.user._id;
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const complaints = await Complaint.find(filter)
      .populate('complainant', 'name email phone')
      .populate('booking', 'bookingId startDate endDate vehicle')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Complaint.countDocuments(filter);
    
    res.json({
      success: true,
      data: complaints,
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

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('complainant', 'name email phone')
      .populate('booking');
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'superadmin' && 
        complaint.complainant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const { status, priority, response } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    
    // Only super admin can update status and priority
    if (req.user.role === 'superadmin') {
      if (status) complaint.status = status;
      if (priority) complaint.priority = priority;
      if (response) complaint.response = response;
    } else if (complaint.complainant.toString() === req.user._id.toString()) {
      // Complainant can only update description
      if (req.body.description) complaint.description = req.body.description;
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await complaint.save();
    
    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('complainant', 'name email phone')
      .populate('booking', 'bookingId startDate endDate');
    
    res.json({ success: true, data: updatedComplaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    
    // Only super admin or complainant can delete
    if (req.user.role !== 'superadmin' && 
        complaint.complainant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplaintStats = async (req, res) => {
  try {
    let matchFilter = {};
    
    if (req.user.role !== 'superadmin') {
      matchFilter.complainant = req.user._id;
    }
    
    const stats = await Complaint.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalComplaints: { $sum: 1 },
          openComplaints: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          inProgressComplaints: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          resolvedComplaints: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          closedComplaints: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          },
          highPriorityComplaints: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json({ success: true, data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};