const multer = require('multer');
const path = require('path');

// Set up storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Store images in the public/uploads folder
  },
  filename: (req, file, cb) => {
    // Set a unique file name to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter to allow only image files (JPEG, PNG, GIF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Allow file upload
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer with the storage and file filter settings
const upload = multer({ storage, fileFilter });

// Controller to handle file upload
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Send back the path to the uploaded file
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file,
  });
};

module.exports = {
  upload,
  uploadImage,
};
