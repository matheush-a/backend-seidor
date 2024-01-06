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
router.delete('/vehicles', async (req, res) => {
  VehicleController.destroy(req, res);
});
router.get('/vehicles', async (req, res) => {
  VehicleController.index(req, res);
});
router.get('/vehicles/getOne', async (req, res) => {
  VehicleController.show(req, res);
});
router.patch('/vehicles', async (req, res) => {
  VehicleController.update(req, res);
});
router.post('/vehicles', async (req, res) => {
  VehicleController.store(req, res);
});

// Vehicles used by drivers
router.get('/vehicle_driver', async (req, res) => {
  VehicleDriverController.index(req, res);
});
router.patch('/vehicle_driver', async (req, res) => {
  VehicleDriverController.update(req, res);
});
router.post('/vehicle_driver', async (req, res) => {
  VehicleDriverController.store(req, res);
});

module.exports = router;