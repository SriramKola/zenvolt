const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: [
        'https://zenvolt-eight.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth/google', require('./routes/google'));
app.use('/api/stations', require('./routes/stations'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/profile', require('./routes/profile'));

app.get('/', (req, res) => res.json({ message: 'Zenvolt API is running' }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 5000, () =>
            console.log(`Server running on port ${process.env.PORT || 5000}`)
        );
    })
    .catch(err => console.error('MongoDB connection error:', err));
