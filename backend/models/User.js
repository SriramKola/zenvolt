const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    walletBalance: { type: Number, default: 0 },
    vehicles: [{ model: String, plate: String, isPrimary: Boolean }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
