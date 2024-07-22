const express = require('express');
const sensorController = require('../cotrollers/sensorController');
const router = express.Router();

router.post('/sensor', sensorController.createSensor);
router.get('/sensor', sensorController.getSensor);
router.get('/sensors', sensorController.getSensors);


module.exports = router;