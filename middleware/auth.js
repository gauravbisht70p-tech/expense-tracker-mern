const jwt = require('jsonwebtoken');
const { isInMemoryMode } = require('../config/db');

// In-memory user store for when MongoDB is not available
let inMemoryUsers = [];

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'expense_tracker_secret_key_2024');

    if (isInMemoryMode()) {
      const user = inMemoryUsers.find(u => u._id === decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
      }
      req.user = { id: user._id, _id: user._id, name: user.name, email: user.email };
    } else {
      const User = require('../models/User');
      req.user = await User.findById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }
};

// Helper to access in-memory users from auth controller
const getInMemoryUsers = () => inMemoryUsers;

module.exports = { protect, getInMemoryUsers };
