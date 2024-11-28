const User = require('../models/User');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);  // Ensure this step is done

    // Create a new user instance with the hashed password
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,  // Store the hashed password, not the plaintext one
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

module.exports = signUp;
