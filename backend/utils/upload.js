const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files in 'public/uploads'
    cb(null, path.join(__dirname, '..', 'public', 'uploads')); 
  },
  filename: (req, file, cb) => {
    // Use a timestamp to avoid file name collisions
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
