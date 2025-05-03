
const express = require('express');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const router = express.Router();

// Seeker: View Own Bookings
router.get('/', auth(['seeker']), async (req, res) => {
  try {
    const bookings = await Booking.find({ seeker: req.user.id })
      .populate({
        path: 'service',
        populate: { path: 'provider', select: 'name email _id' }
      });

    // Remove empty package if not booked
    const sanitized = bookings.map(b => {
      const plain = b.toObject();
      if (!plain.package?.name) delete plain.package;
      return plain;
    });

    res.json(sanitized);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: View All Bookings
router.get('/admin', auth(['admin']), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'seeker',
        select: 'name email _id'
      })
      .populate({
        path: 'service',
        populate: { path: 'provider', select: 'name email _id' }
      });

    // Remove empty packages from response
    const sanitized = bookings.map(b => {
      const plain = b.toObject();

      // Remove package if it wasn't booked
      if (!plain.package?.name) {
        delete plain.package;
      }

      return plain;
    });

    res.json(sanitized);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Provider: View Bookings for Their Services
router.get('/provider', auth(['provider']), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'service',
        match: { provider: req.user.id }
      })
      .populate({
        path: 'seeker',
        select: 'name email _id'
      });

    // Filter only bookings for this provider's services
    const filtered = bookings.filter(b => b.service !== null);

    // Sanitize: remove provider info, remove empty package
    const sanitized = filtered.map(b => {
      const plain = b.toObject();

      // Remove service.provider if exists
      if (plain.service?.provider) delete plain.service.provider;

      // Remove package if not booked
      if (!plain.package?.name) delete plain.package;

      return plain;
    });

    res.json(sanitized);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a Booking
router.post('/', auth(['seeker']), async (req, res) => {
  try {
    const { service: serviceId, date, time, packageIndex } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    let selectedPackage = null;

    // Only attach package if seeker selected one
    if (typeof packageIndex === 'number' && service.packages[packageIndex]) {
      selectedPackage = service.packages[packageIndex];
    }

    const booking = await Booking.create({
      seeker: req.user.id,
      service: serviceId,
      package: selectedPackage,
      date,
      time,
      status: 'pending'
    });

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to book service' });
  }
});

// Delete Booking (Seeker)
router.delete('/:bookingId/seeker', auth(['seeker']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow deletion if booking belongs to this seeker
    if (booking.seeker.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot delete completed service' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
