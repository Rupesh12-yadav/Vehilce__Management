const Document = require('../models/Document');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

exports.uploadDocument = async (req, res) => {
  try {
    const { documentType, documentUrl, vehicleId } = req.body;
    
    const document = await Document.create({
      user: req.user._id,
      vehicle: vehicleId || null,
      documentType,
      documentUrl,
      status: 'pending'
    });
    
    res.status(201).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { status, documentType, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (req.user.role !== 'superadmin') {
      filter.user = req.user._id;
    }
    if (status) filter.status = status;
    if (documentType) filter.documentType = documentType;
    
    const documents = await Document.find(filter)
      .populate('user', 'name email role')
      .populate('vehicle', 'name registrationNumber')
      .populate('approvedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Document.countDocuments(filter);
    
    res.json({
      success: true,
      data: documents,
      pagination: { current: page, pages: Math.ceil(total / limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveDocument = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    
    document.status = status;
    if (status === 'rejected') {
      document.rejectionReason = rejectionReason;
    } else if (status === 'approved') {
      document.approvedBy = req.user._id;
      document.approvedAt = new Date();
      
      // Update user/vehicle verification status
      if (document.documentType === 'license' || document.documentType === 'aadhar') {
        await User.findByIdAndUpdate(document.user, { isVerified: true });
      } else if (document.vehicle) {
        await Vehicle.findByIdAndUpdate(document.vehicle, { isVerified: true });
      }
    }
    
    await document.save();
    
    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};