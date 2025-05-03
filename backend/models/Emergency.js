
const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  seeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceNeeded: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Emergency', EmergencySchema);
