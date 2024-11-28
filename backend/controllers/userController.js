// controllers/userController.js
const User = require('../models/User');
const Club = require('../models/Club'); // Assuming you have a Club model

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle club membership actions (accept/reject)
exports.handleClubMembership = async (req, res) => {
  const { action } = req.body; // 'accept' or 'reject'
  const userId = req.params.userId;

  if (action !== 'accept' && action !== 'reject') {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update membership status based on action
    user.club.membershipStatus = action === 'accept' ? 'member' : 'pending';
    await user.save();

    res.json({ message: `User's club request has been ${action}ed.` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating club membership' });
  }
};
