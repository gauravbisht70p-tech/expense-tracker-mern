const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { isInMemoryMode } = require('../config/db');
const { getInMemoryUsers } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'expense_tracker_secret_key_2024';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    if (isInMemoryMode()) {
      const users = getInMemoryUsers();
      const exists = users.find(u => u.email === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: String(Date.now()),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date()
      };
      users.push(newUser);

      return res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: { _id: newUser._id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt }
      });
    }

    const User = require('../models/User');

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    if (isInMemoryMode()) {
      const users = getInMemoryUsers();
      const user = users.find(u => u.email === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      return res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
      });
    }

    const User = require('../models/User');

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (isInMemoryMode()) {
      const users = getInMemoryUsers();
      const user = users.find(u => u._id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      return res.status(200).json({
        success: true,
        user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
      });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
