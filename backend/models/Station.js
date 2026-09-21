const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
    slots: { type: Number, required: true },
    available: { type: Number, required: true },
    price: { type: String, required: true },
    type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);
