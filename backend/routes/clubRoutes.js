// routes/clubRoutes.js
const express = require('express');
const router = express.Router();
const Club = require('../models/Club');  // Import the Club model

// POST route to create a new club
router.post('/api/clubs', async (req, res) => {
  const { title, description, image, hashtags } = req.body;

  try {
    const newClub = new Club({
      title,
      description,
      image,
      hashtags,
    });

    await newClub.save();
    res.status(201).json({ message: 'Club created successfully!', club: newClub });
  } catch (error) {
    console.error('Error creating the club:', error);
    res.status(500).json({ error: 'Error creating the club' });
  }
});

router.get('/api/clubs', async (req, res) => {

  try {
    const clubs = await Club.find();
    res.status(200).json({ message: 'Data found', data: clubs });
  } catch (error) {
    console.error('Error creating the club:', error);
    res.status(500).json({ error: 'Error creating the club' });
  }
});

module.exports = router;
