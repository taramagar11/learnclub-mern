const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Fetch all users (admin-only route)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Handle club request action (accept/reject) - Admin only
router.post('/users/:userId/join-club', async (req, res) => {
  const { userId } = req.params;
  const { action } = req.body;  // Either 'accept' or 'reject'

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure the user has a club field and update membership status
    user.club = user.club || {};  // Ensure club field exists
    user.club.membershipStatus = action === 'accept' ? 'member' : 'pending';

    await user.save();
    res.json({ message: `User's club request has been ${action}ed.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating club membership' });
  }
});

// Delete a user (Admin only)
router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
