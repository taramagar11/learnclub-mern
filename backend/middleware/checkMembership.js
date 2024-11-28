// middlewares/checkMembership.js
const Club = require('../models/Club'); // Ensure the path to your models is correct
const User = require('../models/User'); // Adjust path if necessary

const checkMembership = async (req, res, next) => {
  const { clubId } = req.params;
  const userId = req.user._id;  // Extract userId from the authenticated user

  try {
    // Find the club by ID
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if the user is a member of the club
    if (!club.members.includes(userId)) {
      return res.status(403).json({ message: 'You are not a member of this club' });
    }

    next();  // Proceed if the user is a member
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = checkMembership;
