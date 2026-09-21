const router = require('express').Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update profile
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { name, phone }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add money to wallet
router.post('/wallet/add', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { walletBalance: amount } },
            { new: true }
        ).select('-password');

        res.json({ walletBalance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add vehicle
router.post('/vehicles', authMiddleware, async (req, res) => {
    try {
        const { model, plate, isPrimary } = req.body;
        const user = await User.findById(req.user.id);

        if (isPrimary) user.vehicles.forEach(v => v.isPrimary = false);
        user.vehicles.push({ model, plate, isPrimary });
        await user.save();

        res.json(user.vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
