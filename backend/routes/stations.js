const router = require('express').Router();
const Station = require('../models/Station');

const seedStations = [
    { name: 'City Mall Charging Hub', lat: 17.4065, lng: 78.4772, status: 'available', slots: 8, available: 5, price: '₹15/hour', type: 'Fast Charging' },
    { name: 'Tech Park Station', lat: 17.4239, lng: 78.4738, status: 'busy', slots: 6, available: 1, price: '₹12/hour', type: 'Standard' },
    { name: 'Airport Express Hub', lat: 17.2403, lng: 78.4294, status: 'available', slots: 12, available: 8, price: '₹20/hour', type: 'Super Fast' },
    { name: 'Metro Station Point', lat: 17.4435, lng: 78.3772, status: 'available', slots: 4, available: 2, price: '₹10/hour', type: 'Standard' }
];

// Get all stations (seed if empty)
router.get('/', async (req, res) => {
    try {
        let stations = await Station.find();
        if (stations.length === 0) {
            stations = await Station.insertMany(seedStations);
        }
        res.json(stations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single station
router.get('/:id', async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);
        if (!station) return res.status(404).json({ message: 'Station not found' });
        res.json(station);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
