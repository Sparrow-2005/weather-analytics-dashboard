const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        // req.user is available from Passport's deserializeUser
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const addFavoriteCity = async (req, res) => {
    const { city } = req.body;
    if (!city) {
        return res.status(400).json({ msg: 'City is required.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (user.favoriteCities.includes(city)) {
            return res.status(400).json({ msg: 'City already in favorites.' });
        }
        user.favoriteCities.push(city);
        await user.save();
        res.json(user.favoriteCities);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const removeFavoriteCity = async (req, res) => {
    const { city } = req.body;
    if (!city) {
        return res.status(400).json({ msg: 'City is required.' });
    }
    try {
        const user = await User.findById(req.user.id);
        user.favoriteCities = user.favoriteCities.filter(
            (favCity) => favCity!== city
        );
        await user.save();
        res.json(user.favoriteCities);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getUserProfile,
    addFavoriteCity,
    removeFavoriteCity,
};