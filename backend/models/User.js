const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },  // Field to distinguish admin users
  clubs: [{ // Allow users to join multiple clubs
    membershipStatus: { type: String, enum: ['pending', 'member'], default: 'pending' }, // Club membership status (pending or accepted)
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }  // Reference to Club model
  }]
});

module.exports = mongoose.model('User', userSchema);
