const axios = require('axios');

const API_BASE_URL = 'http://api.weatherapi.com/v1';
const API_KEY = process.env.WEATHER_API_KEY;

// Controller to get current weather
const getCurrentWeather = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ msg: 'Query parameter "q" is required.' });
    }
    try {
        const url = `${API_BASE_URL}/current.json?key=${API_KEY}&q=${q}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Controller to get forecast
const getForecast = async (req, res) => {
    const { q, days = 7 } = req.query;
    if (!q) {
        return res.status(400).json({ msg: 'Query parameter "q" is required.' });
    }
    try {
        const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${q}&days=${days}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Controller for city search/autocomplete
const searchCities = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ msg: 'Query parameter "q" is required.' });
    }
    try {
        const url = `${API_BASE_URL}/search.json?key=${API_KEY}&q=${q}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getCurrentWeather,
    getForecast,
    searchCities,
};