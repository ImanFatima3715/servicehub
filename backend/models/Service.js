
const mongoose = require('mongoose');

const ServicePackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  visitsIncluded: {
    type: Number,
    required: true
  },
  discountPercent: {
    type: Number,
    required: true
  },
  finalPrice: {
    type: Number,
    required: true
  }
});

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packages: [ServicePackageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', ServiceSchema);
