// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your user model is at this path
const protect = require('../middleware/authMiddleware');

const router = express.Router(); // Initialize the router

// Signup Route
router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the email is already in use
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ fullName, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
});

// User joins a club (request to join)
router.post('/join-club/:clubId', protect, async (req, res) => {
  const userId = req.user._id; // Get user from JWT token
  const { clubId } = req.params;

  try {
    // Check if the user is already a member of the club
    const club = await Club.findById(clubId);
    if (club.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already a member of this club.' });
    }

    // Create a join request
    const joinRequest = new JoinRequest({
      user: userId,
      club: clubId,
    });

    await joinRequest.save();
    res.status(201).json({ message: 'Join request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending join request' });
  }
});
module.exports = router;
