const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Club = require('../models/Club');
const JoinRequest = require('../models/JoinRequest'); // Import JoinRequest model
const router = express.Router();
const protect = require('../middleware/authMiddleware');


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

// Get all non-admin users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: { $ne: true } }); // Exclude admin users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Admin views pending join requests for a club
router.get('/club/:clubId/pending-requests', protect, async (req, res) => {
  const { clubId } = req.params;
  
  try {
    // Find all pending join requests for the club
    const pendingRequests = await JoinRequest.find({ club: clubId, status: 'pending' })
      .populate('user', 'email') // Populate the user details
      .populate('club', 'name');

    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending join requests' });
  }
});

// Admin accepts or rejects a join request
router.post('/club/:clubId/handle-request/:requestId', protect, async (req, res) => {
  const { clubId, requestId } = req.params;
  const { action } = req.body; // action: 'accept' or 'reject'

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    // Find the join request
    const joinRequest = await JoinRequest.findById(requestId);
    if (!joinRequest || joinRequest.club.toString() !== clubId) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Update the request status
    joinRequest.status = action === 'accept' ? 'accepted' : 'rejected';
    await joinRequest.save();

    if (action === 'accept') {
      // Add the user to the club's members array
      const club = await Club.findById(clubId);
      club.members.push(joinRequest.user);
      await club.save();
    }

    res.json({ message: `Request ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error handling join request' });
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

router.use('/clubs', require('./clubRoutes')); // Import the club routes

module.exports = router;
