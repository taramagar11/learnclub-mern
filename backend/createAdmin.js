// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const User = require('./models/User'); // Make sure the path is correct

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// const createAdmin = async () => {
//   const hashedPassword = await bcrypt.hash('admin11', 10); // Hash the password

//   const admin = new User({
//     fullName: 'Admin User',
//     email: 'admin11@gmail.com', // Ensure this email is unique
//     password: hashedPassword,
//     isAdmin: true, // Set isAdmin flag to true
//   });

//   try {
//     await admin.save();
//     console.log('Admin user created');
//   } catch (err) {
//     console.error('Error creating admin:', err);
//   }
// };

// createAdmin().catch((err) => console.error(err));
