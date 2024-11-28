const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController'); // Import multer setup and uploadImage function

// POST route to upload an image
router.post('/upload', uploadController.upload.single('image'), uploadController.uploadImage);

module.exports = router;
