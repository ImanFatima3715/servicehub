
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, 10);
    
    // Create user
    user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role 
    });

    // Return user (without password)
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;
    
    res.json(userToReturn);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If provider, check if approved
    if (user.role === 'provider' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    // Create and return JWT token
    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Google login
router.post('/google/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    // If provider, check if approved
    if (user.role === 'provider' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    // Create and return JWT token
    const jwtPayload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Google login error:', err.message);
    res.status(500).send('Server error');
  }
});

// Google register
router.post('/google/register', async (req, res) => {
  try {
    const { idToken, role } = req.body;
    
    if (!role || !['seeker', 'provider'].includes(role)) {
      return res.status(400).json({ message: 'Valid role is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists. Please login instead.' });
    }

    // Create random password for Google users
    const password = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);

    // Create new user
    user = await User.create({
      name,
      email,
      password,
      role,
      profileImage: picture
    });

    // Create and return JWT token
    const jwtPayload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Google registration error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
