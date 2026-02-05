const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

async function connectDB() {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        console.error('MongoDB connection error: MONGO_URI is not set. Check your .env file.');
        return;
    }

    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message || err);
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;