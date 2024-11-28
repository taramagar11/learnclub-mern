// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log('MongoDB connected');
  } catch (err) {
    console.log('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process if MongoDB connection fails
  }
};

module.exports = connectDB; // Export the connectDB function
