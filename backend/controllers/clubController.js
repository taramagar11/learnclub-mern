const Club = require('../models/Club');
const path = require('path');

// Get a single club by ID
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club); // Send the club object as the response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching club', error: error.message });
  }
};

// Add a new club
const addClub = async (req, res) => {
  try {
    const { title, description, hashtags, createdBy } = req.body;
    const image = req.file ? path.join('uploads', req.file.filename) : null; // Save relative image path

    // Validate required fields
    if (!title || !description || !hashtags) {
      return res.status(400).json({ message: 'Title, description, and hashtags are required.' });
    }

    // Create a new club document
    const newClub = new Club({
      title,
      description,
      image, // Store the image path
      hashtags: hashtags.split(','), // Convert comma-separated hashtags to an array
      createdBy,
    });

    // Save the new club to the database
    await newClub.save();
    res.status(201).json(newClub); // Send the newly created club as the response
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateClub = async (req, res) => {
  try {
    const { clubId } = req.params; // clubId should be in req.params
    console.log('Club ID:', clubId); // Debugging log
    const { title, description, hashtags } = req.body;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    club.title = title || club.title;
    club.description = description || club.description;
    club.hashtags = hashtags ? hashtags.split(',').map(tag => tag.trim()) : club.hashtags;

    if (req.file) {
      club.image = path.join('uploads', req.file.filename);
    }

    const updatedClub = await club.save();
    res.status(200).json(updatedClub);
  } catch (error) {
    console.log(error); // Log the error to see what is going wrong
    res.status(500).json({ message: 'Error updating club', error: error.message });
  }
};

// Delete a club
const deleteClub = async (req, res) => {
  try {
    const deletedClub = await Club.findByIdAndDelete(req.params.clubId);
    if (!deletedClub) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.status(200).json({ message: 'Club deleted successfully' }); // Return success message
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all clubs
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs); // Return all clubs as the response
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Export functions
module.exports = { addClub, updateClub, deleteClub, getClubs, getClubById };
