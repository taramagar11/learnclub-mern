const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  clubs: [
    {
      membershipStatus: { type: String, enum: ['pending', 'member'], default: 'pending' },
      clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }
    }
  ]
});

// Hash password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // If password not modified, skip hashing
  const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});

// Method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
