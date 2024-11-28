const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Club = require('./models/Club');
const User = require('./models/User');

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, role: user.role, userName: user.fullName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Get all clubs (for admin dashboard)
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving clubs' });
  }
};

// Approve join request for a club
exports.approveJoinRequest = async (req, res) => {
  const { clubId, userId } = req.body;
  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Logic to approve join request
    club.members.push(userId);
    await club.save();

    res.status(200).json({ message: 'Join request approved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error approving join request' });
  }
};

// Reject join request for a club
exports.rejectJoinRequest = async (req, res) => {
  const { clubId, userId } = req.body;
  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Logic to reject join request (remove from pending list, etc.)
    club.pendingMembers = club.pendingMembers.filter((id) => id !== userId);
    await club.save();

    res.status(200).json({ message: 'Join request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rejecting join request' });
  }
};
 