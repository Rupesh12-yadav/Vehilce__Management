const express = require('express');
const { 
  createVehicle, 
  getVehicles, 
  getMyVehicles, 
  getVehicleById,
  updateVehicle, 
  deleteVehicle,
  toggleAvailability,
  getVehicleStats
} = require('../controllers/vehicleController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Vehicle admin routes
router.post('/', auth, checkRole(['vehicleadmin']), createVehicle);
router.get('/my/vehicles', auth, checkRole(['vehicleadmin']), getMyVehicles);
router.get('/my/stats', auth, checkRole(['vehicleadmin']), getVehicleStats);
router.put('/:id', auth, checkRole(['vehicleadmin']), updateVehicle);
router.patch('/:id/availability', auth, checkRole(['vehicleadmin']), toggleAvailability);
router.delete('/:id', auth, checkRole(['vehicleadmin', 'superadmin']), deleteVehicle);

module.exports = router;