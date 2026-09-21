const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: 'google_oauth_' + profile.id,
                phone: ''
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// Google login
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google callback
router.get('/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login.html?error=google_failed` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.redirect(`${process.env.FRONTEND_URL}/login.html?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&id=${req.user._id}`);
    }
);

module.exports = router;
