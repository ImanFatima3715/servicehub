
const express = require('express');
const auth = require('../middleware/auth');
const Service = require('../models/Service');
const router = express.Router();

// Add Service
router.post('/', auth(['provider']), async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      provider: req.user.id
    });
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('provider', 'name email _id');
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name email _id');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add package to service (Admin only)
router.post('/:serviceId/package', auth(['admin']), async (req, res) => {
  try {
    const { name, duration, visitsIncluded, discountPercent, finalPrice } = req.body;
    const service = await Service.findById(req.params.serviceId);
  
    if (!service) return res.status(404).json({ message: 'Service not found' });
  
    service.packages.push({
      name,
      duration,
      visitsIncluded,
      discountPercent,
      finalPrice
    });
  
    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service (Admin only)
router.delete('/:serviceId/admin', auth(['admin']), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.serviceId);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
  
    res.json({ message: 'Service deleted by admin', service });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
