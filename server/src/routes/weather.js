// src/routes/weather.js

const express = require('express');
const router = express.Router();

const {
  getCurrentWeather,
  getForecast,
  searchCities,
} = require('../controllers/weatherController');

const cacheMiddleware = require('../middleware/cache');

// Define routes
router.get('/current', cacheMiddleware, getCurrentWeather);
router.get('/forecast', cacheMiddleware, getForecast);
router.get('/search', cacheMiddleware, searchCities);

module.exports = router;
