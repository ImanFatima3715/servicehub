
const express = require('express');
const Emergency = require('../models/Emergency');
const auth = require('../middleware/auth');
const router = express.Router();

// Create emergency request
router.post('/', auth(['seeker']), async (req, res) => {
  try {
    const request = await Emergency.create({
      ...req.body,
      seeker: req.user.id
    });
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all emergency requests (admin)
router.get('/admin', auth(['admin']), async (req, res) => {
  try {
    const emergencies = await Emergency.find().populate('seeker', 'name email _id');
    res.json(emergencies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
