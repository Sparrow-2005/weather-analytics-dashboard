const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const {
    getUserProfile,
    addFavoriteCity,
    removeFavoriteCity,
} = require('../controllers/userController');


router.get('/me', ensureAuth, getUserProfile);

router.post('/favorites', ensureAuth, addFavoriteCity);

router.delete('/favorites', ensureAuth, removeFavoriteCity);

module.exports = router;