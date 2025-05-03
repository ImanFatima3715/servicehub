
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user
router.get('/me', auth([]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all providers (for admin)
router.get('/providers', auth(['admin']), async (req, res) => {
  try {
    const providers = await User.find({ role: 'provider' }).select('-password');
    res.json(providers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Approve a provider
router.put('/approve/:id', auth(['admin']), async (req, res) => {
  try {
    const provider = await User.findByIdAndUpdate(
      req.params.id, 
      { isApproved: true }, 
      { new: true }
    ).select('-password');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    res.json(provider);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
