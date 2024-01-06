const express = require('express');
const router = express.Router();

const DriverController = require('../controllers/driver.controller');
const VehicleController = require('../controllers/vehicle.controller');
const VehicleDriverController = require('../controllers/vehicleDriver.controller');

// Drivers
router.delete('/drivers', async (req, res) => {
  DriverController.destroy(req, res);
});
router.get('/drivers', async (req, res) => {
  DriverController.index(req, res);
});
router.get('/drivers/getOne', async (req, res) => {
  DriverController.show(req, res);
});
router.patch('/drivers', async (req, res) => {
  DriverController.update(req, res);
});
router.post('/drivers', async (req, res) => {
  DriverController.store(req, res);
});

// Vehicles

// Vehicles used by drivers

module.exports = router;