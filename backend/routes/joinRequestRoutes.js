// routes/joinRequest.js
const express = require('express');
const router = express.Router();
const JoinRequest = require('../models/JoinRequest');
const User = require('../models/User');
const Club = require('../models/Club');
const authMiddleware = require('../middleware/authMiddleware');

// Create a join request
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { clubId } = req.body;

    // Check if the club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Create the join request
    const joinRequest = new JoinRequest({
      user: req.user.id, // req.user.id comes from the authentication middleware
      club: clubId,
    });

    await joinRequest.save();
    res.status(200).json({ message: 'Join request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
