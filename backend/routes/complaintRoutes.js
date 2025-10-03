const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintStats
} = require('../controllers/complaintController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

// Common routes
router.post('/', auth, createComplaint);
router.get('/', auth, getComplaints);
router.get('/stats', auth, getComplaintStats);
router.get('/:id', auth, getComplaintById);
router.put('/:id', auth, updateComplaint);
router.delete('/:id', auth, deleteComplaint);

module.exports = router;