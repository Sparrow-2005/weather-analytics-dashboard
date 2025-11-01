const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
    (req, res) => {
        // Successful authentication, redirect to frontend dashboard.
        res.redirect('http://localhost:3000/');
    }
);

// @desc    Logout user
// @route   POST /auth/logout
router.post('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Could not log out.' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Successfully logged out.' });
        });
    });
});

module.exports = router;