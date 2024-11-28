const express = require('express');
const multer = require('multer');  // Add multer import
const path = require('path');
const { addContent, getContentList, getContentById, updateContent, deleteContent } = require('../controllers/contentController');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Ensure unique filenames
  },
});

const upload = multer({ storage });  // Initialize multer

// Add new content
router.post('/', upload.fields([{ name: 'image' }, { name: 'video' }]), addContent);

// Get all content
router.get('/', getContentList);

// Get a single content by ID
router.get('/:id', getContentById);

// Update content by ID
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'video' }]), updateContent);

// Delete content by ID
router.delete('/:id', deleteContent);

module.exports = router;
