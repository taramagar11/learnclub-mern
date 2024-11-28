const express = require('express');
const router = express.Router();
const Content = require('../models/Content'); // Assuming you have a Content model
const Club = require('../models/Club'); // Assuming you have a Club model
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// GET all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.find().populate('club');
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// POST create new content
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const newContent = new Content({
      title: req.body.title,
      description: req.body.description,
      image: req.files['image'] ? req.files['image'][0].path : null,
      video: req.files['video'] ? req.files['video'][0].path : null,
      club: req.body.club,
    });
    await newContent.save();
    res.json(newContent);
  } catch (err) {
    res.status(500).json({ message: 'Error creating content' });
  }
});

// DELETE content
router.delete('/:contentId', async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.contentId);
    res.status(200).json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting content' });
  }
});

module.exports = router;
