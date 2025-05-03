module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
       type: String
  }, 
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['seeker', 'provider', 'admin'],
    default: 'seeker'
  },
  profileImage: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role !== 'provider'; // Auto-approve non-providers
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
