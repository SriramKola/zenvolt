const router = require('express').Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const prices = { 1: 50, 2: 90, 3: 130, 4: 160 };

// Create booking
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { stationId, stationName, serviceType, chargingType, bookingTime, duration, vehicleModel, phone, pickupAddress } = req.body;

        const amount = prices[duration] + (serviceType === 'pickup' ? 200 : 0);

        const user = await User.findById(req.user.id);
        if (user.walletBalance < amount)
            return res.status(400).json({ message: 'Insufficient wallet balance' });

        user.walletBalance -= amount;
        await user.save();

        const booking = await Booking.create({
            user: req.user.id, stationId, stationName, serviceType,
            chargingType, bookingTime, duration, vehicleModel, phone, amount, pickupAddress
        });

        res.status(201).json({ booking, walletBalance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user bookings
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cancel booking (80% refund)
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'confirmed') return res.status(400).json({ message: 'Cannot cancel this booking' });

        const refund = Math.floor(booking.amount * 0.8);
        booking.status = 'cancelled';
        await booking.save();

        const user = await User.findById(req.user.id);
        user.walletBalance += refund;
        await user.save();

        res.json({ message: 'Booking cancelled', refund, walletBalance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
