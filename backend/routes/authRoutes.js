const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        failureRedirect: '/register',
        successRedirect: '/dashboard' // or wherever you want
    })
);
router.post('/google', googleLogin);
router.post('/google', googleRegister);

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
