// /middleware/isAdmin.js
const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use environment variable for secret
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = isAdmin;
