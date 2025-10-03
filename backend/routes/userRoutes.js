const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getProfile,
  updateProfile
} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Admin routes
router.get('/', auth, checkRole(['superadmin']), getAllUsers);
router.get('/stats', auth, checkRole(['superadmin']), getUserStats);
router.get('/:id', auth, checkRole(['superadmin']), getUserById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, checkRole(['superadmin']), deleteUser);

module.exports = router;