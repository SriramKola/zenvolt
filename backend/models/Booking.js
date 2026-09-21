const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stationId: { type: Number, required: true },
    stationName: { type: String, required: true },
    serviceType: { type: String, enum: ['self', 'pickup'], required: true },
    chargingType: { type: String, required: true },
    bookingTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    vehicleModel: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' },
    pickupAddress: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
