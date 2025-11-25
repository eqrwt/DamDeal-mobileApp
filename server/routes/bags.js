const express = require('express');
const { body, validationResult } = require('express-validator');
const Bag = require('../models/Bag');
const Partner = require('../models/Partner');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all active bags (for customers)
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, category } = req.query;
    
    let query = {
      isActive: true,
      isSoldOut: false,
      'pickupTime.start': { $gte: new Date() }
    };

    if (category) {
      query.category = category;
    }

    let bags = await Bag.find(query)
      .populate('partner', 'businessName address rating')
      .sort({ 'pickupTime.start': 1 });

    // Filter by distance if coordinates provided
    if (latitude && longitude) {
      bags = bags.filter(bag => {
        if (!bag.partner.address.coordinates) return false;
        
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          bag.partner.address.coordinates.latitude,
          bag.partner.address.coordinates.longitude
        );
        
        return distance <= parseFloat(radius);
      });
    }

    res.json(bags);

  } catch (error) {
    console.error('Get bags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bags by partner (for partner app)
router.get('/partner', auth, async (req, res) => {
  try {
    const bags = await Bag.find({ partner: req.partner.id })
      .sort({ createdAt: -1 });

    res.json(bags);

  } catch (error) {
    console.error('Get partner bags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new bag (partner only)
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('originalPrice').isFloat({ min: 0 }).withMessage('Valid original price is required'),
  body('discountedPrice').isFloat({ min: 0 }).withMessage('Valid discounted price is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
  body('pickupTime.start').isISO8601().withMessage('Valid pickup start time is required'),
  body('pickupTime.end').isISO8601().withMessage('Valid pickup end time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      originalPrice,
      discountedPrice,
      quantity,
      pickupTime,
      category,
      tags,
      image
    } = req.body;

    // Validate pickup time
    const startTime = new Date(pickupTime.start);
    const endTime = new Date(pickupTime.end);
    
    if (startTime <= new Date()) {
      return res.status(400).json({ message: 'Pickup start time must be in the future' });
    }
    
    if (endTime <= startTime) {
      return res.status(400).json({ message: 'Pickup end time must be after start time' });
    }

    const bag = new Bag({
      partner: req.partner.id,
      title,
      description,
      originalPrice,
      discountedPrice,
      quantity,
      availableQuantity: quantity,
      pickupTime: {
        start: startTime,
        end: endTime
      },
      category,
      tags,
      image
    });

    await bag.save();

    res.status(201).json(bag);

  } catch (error) {
    console.error('Create bag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bag (partner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const bag = await Bag.findOne({ _id: req.params.id, partner: req.partner.id });
    
    if (!bag) {
      return res.status(404).json({ message: 'Bag not found' });
    }

    const updates = req.body;
    
    // Don't allow updating if bag has orders
    if (bag.quantity !== bag.availableQuantity) {
      return res.status(400).json({ message: 'Cannot update bag with existing orders' });
    }

    Object.keys(updates).forEach(key => {
      if (key !== 'partner' && key !== '_id') {
        bag[key] = updates[key];
      }
    });

    await bag.save();
    res.json(bag);

  } catch (error) {
    console.error('Update bag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark bag as sold out (partner only)
router.patch('/:id/sold-out', auth, async (req, res) => {
  try {
    const bag = await Bag.findOne({ _id: req.params.id, partner: req.partner.id });
    
    if (!bag) {
      return res.status(404).json({ message: 'Bag not found' });
    }

    bag.isSoldOut = true;
    bag.isActive = false;
    await bag.save();

    res.json({ message: 'Bag marked as sold out' });

  } catch (error) {
    console.error('Mark sold out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single bag
router.get('/:id', async (req, res) => {
  try {
    const bag = await Bag.findById(req.params.id)
      .populate('partner', 'businessName address phone rating');

    if (!bag) {
      return res.status(404).json({ message: 'Bag not found' });
    }

    res.json(bag);

  } catch (error) {
    console.error('Get bag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;
