const express = require('express');
const multer = require('multer');
const Club = require('../models/Club');
const clubController = require('../controllers/clubController');
const protect = require('../middlewares/authMiddleware');
const membership = require('../middleware/checkMembership');
const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Set the upload directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and original file name
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only allow image files (this can be extended based on requirements)
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(file.mimetype);
    const basename = allowedTypes.test(file.originalname.toLowerCase());

    if (extname && basename) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed.'));
  }
});

// Public routes: Anyone can access
router.get('/', clubController.getClubs);  // Get all clubs
router.get('/:clubId', clubController.getClubById);  // Get specific club

// Protected routes: Require authentication
router.post('/', protect, upload.single('image'), clubController.addClub);  // Add a new club
router.put('/:clubId', protect, upload.single('image'), clubController.updateClub);  // Update club
router.delete('/:clubId', protect, clubController.deleteClub);  // Delete a club

// Example of a route requiring membership check (e.g., to access club content)
router.get('/:clubId/content', protect, checkMembership, clubController.getClubContent);  // Only members can access this

module.exports = router;
