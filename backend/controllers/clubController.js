// /controllers/clubController.js
const Club = require('../models/Club');

// Add a new club
const addClub = async (req, res) => {
  try {
    const { title, description, image, hashtags } = req.body;

    if (!title || !description || !hashtags) {
      return res.status(400).json({ message: 'Title, description, and hashtags are required.' });
    }

    const newClub = new Club({
      title,
      description,
      image,
      hashtags,
    });

    await newClub.save();
    res.status(201).json(newClub);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Edit an existing club
const editClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const { title, description, image, hashtags } = req.body;
    club.title = title || club.title;
    club.description = description || club.description;
    club.image = image || club.image;
    club.hashtags = hashtags || club.hashtags;

    await club.save();
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a club
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    await club.remove();
    res.status(200).json({ message: 'Club deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all clubs
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// View members of a specific club
const viewMembers = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('members');
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.status(200).json(club.members);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { addClub, editClub, deleteClub, getClubs, viewMembers };
