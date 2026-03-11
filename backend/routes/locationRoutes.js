const express = require('express');
const { searchLocation, getVehiclesByLocation } = require('../controllers/locationController');
const router = express.Router();

router.get('/search', searchLocation);
router.get('/vehicles', getVehiclesByLocation);

module.exports = router;
