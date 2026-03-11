const express = require('express');
const router = express.Router();
const { uploadVehicle, uploadDocument, uploadProfile, cloudinary } = require('../config/cloudinary');
const auth = require('../middleware/authMiddleware');

// Upload vehicle images (multiple)
router.post('/vehicle', auth, uploadVehicle.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const imageUrls = req.files.map(file => file.path);
    res.json({ 
      success: true, 
      message: 'Images uploaded successfully',
      data: imageUrls 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload single vehicle image
router.post('/vehicle/single', auth, uploadVehicle.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    res.json({ 
      success: true, 
      message: 'Image uploaded successfully',
      data: req.file.path 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload document
router.post('/document', auth, uploadDocument.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document uploaded' });
    }

    res.json({ 
      success: true, 
      message: 'Document uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload profile image
router.post('/profile', auth, uploadProfile.single('profileImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    res.json({ 
      success: true, 
      message: 'Profile image uploaded successfully',
      data: req.file.path 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete image from Cloudinary
router.delete('/delete', auth, async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'Public ID required' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    res.json({ 
      success: true, 
      message: 'Image deleted successfully',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
