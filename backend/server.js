  const express = require('express');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const bodyParser = require('body-parser');
  const mongoose = require('mongoose');
  const userRoutes = require('./routes/userRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  const clubRoutes = require('./routes/clubRoutes');
  const contentRoutes = require('./routes/contentRoutes');

  
  const multer = require('multer');
const path = require('path');

  dotenv.config(); // Load environment variables  

  const app = express();

  // Middleware setup
  app.use(cors());
  app.use(bodyParser.json()); // For parsing application/json
  
  app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Database connection
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection failed:', err));





  // Use routes
  app.get('/', (req, res) => {
    res.send('Hello, Admin!');
  });

  app.use('/api/users', userRoutes);  // Prefix for user API routes
  app.use('/api/admin', adminRoutes); // Prefix for admin API routes
  app.use('/api/admin/clubs', clubRoutes);
  app.use('/api/admin/content', contentRoutes);

  
  
  

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
