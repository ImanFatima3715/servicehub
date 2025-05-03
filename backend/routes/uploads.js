
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Upload or update provider image
router.post('/upload-profile', auth(['provider']), upload.single('image'), async (req, res) => {
  try {
    const imagePath = 'uploads/' + req.file.filename;
    
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { profileImage: imagePath },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Profile image uploaded', 
      imageUrl: imagePath, 
      user 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;
