  const express = require('express');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const router = express.Router();

  // Admin login route
  router.post('/admin-login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check if the user is admin
      if (!user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Not an admin' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Create JWT token
      const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, 'your_secret_key', { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get all users along with their club information, excluding admins
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: { $ne: true } }); // Exclude admin users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Accept or Reject a user's club join request
router.post('/users/:userId/join-club', async (req, res) => {
  const { userId } = req.params;
  const { action } = req.body;  // action: accept or reject

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const user = await User.findById(userId).populate('club.clubId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (action === 'accept') {
      user.club.membershipStatus = 'member';
    } else {
      user.club.membershipStatus = 'rejected';
    }
    await user.save();

    res.json({ message: `User's request has been ${action}ed` });
  } catch (err) {
    res.status(500).json({ message: 'Error processing request' });
  }
});

// Delete a user
router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});
  module.exports = router;
