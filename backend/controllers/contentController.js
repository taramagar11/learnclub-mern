const Content = require('../models/Content');
const path = require('path');
const fs = require('fs');

// Helper function to handle file uploads
const uploadFile = (file, uploadFolder) => {
  return new Promise((resolve, reject) => {
    const filePath = `/uploads/${uploadFolder}/${file.name}`;
    const uploadPath = path.join(__dirname, `../public${filePath}`);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject('Error uploading file.');
      }
      resolve(filePath);
    });
  });
};

// Add new content
exports.addContent = async (req, res) => {
  try {
    const { title, description, club } = req.body;
    const image = req.files?.image;
    const video = req.files?.video;

    // Validate required fields
    if (!title || !description || !club) {
      return res.status(400).json({ message: 'Title, description, and club are required.' });
    }

    // Handle image upload
    let imagePath = '';
    if (image) {
      if (!image.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Uploaded file must be an image.' });
      }
      imagePath = await uploadFile(image, 'images');
    }

    // Handle video upload
    let videoPath = '';
    if (video) {
      if (!video.mimetype.startsWith('video/')) {
        return res.status(400).json({ message: 'Uploaded file must be a video.' });
      }
      videoPath = await uploadFile(video, 'videos');
    }

    // Create content
    const newContent = new Content({
      title,
      description,
      club,
      image: imagePath,
      video: videoPath,
    });

    await newContent.save();
    res.status(201).json({ message: 'Content added successfully!' });
  } catch (err) {
    console.error('Error adding content:', err);
    res.status(500).json({ message: 'Error adding content.' });
  }
};

// Get list of all content
exports.getContentList = async (req, res) => {
  try {
    const contentList = await Content.find();
    res.status(200).json(contentList);
  } catch (err) {
    console.error('Error fetching content list:', err);
    res.status(500).json({ message: 'Error fetching content list.' });
  }
};

// Get a single content by ID
exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found.' });
    }
    res.status(200).json(content);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ message: 'Error fetching content.' });
  }
};

// Update content
exports.updateContent = async (req, res) => {
  try {
    const { title, description, club } = req.body;
    const image = req.files?.image;
    const video = req.files?.video;

    const updatedData = { title, description, club };

    // Handle image upload
    if (image) {
      if (!image.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Uploaded file must be an image.' });
      }
      updatedData.image = await uploadFile(image, 'images');
    }

    // Handle video upload
    if (video) {
      if (!video.mimetype.startsWith('video/')) {
        return res.status(400).json({ message: 'Uploaded file must be a video.' });
      }
      updatedData.video = await uploadFile(video, 'videos');
    }

    const updatedContent = await Content.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedContent) {
      return res.status(404).json({ message: 'Content not found.' });
    }
    res.status(200).json(updatedContent);
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ message: 'Error updating content.' });
  }
};

// Delete content
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    // Optionally, delete files if they exist
    if (content.image) {
      fs.unlinkSync(path.join(__dirname, `../public${content.image}`));
    }
    if (content.video) {
      fs.unlinkSync(path.join(__dirname, `../public${content.video}`));
    }

    res.status(200).json({ message: 'Content deleted successfully!' });
  } catch (err) {
    console.error('Error deleting content:', err);
    res.status(500).json({ message: 'Error deleting content.' });
  }
};
