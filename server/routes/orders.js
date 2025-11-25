const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Bag = require('../models/Bag');
const Partner = require('../models/Partner');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new order (customer)
router.post('/', [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.phone').notEmpty().withMessage('Customer phone is required'),
  body('customer.email').isEmail().withMessage('Valid customer email is required'),
  body('bagId').notEmpty().withMessage('Bag ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
  body('paymentMethod').isIn(['card', 'cash', 'kaspi', 'halyk']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customer, bagId, quantity, paymentMethod, notes } = req.body;

    // Get bag details
    const bag = await Bag.findById(bagId).populate('partner');
    if (!bag) {
      return res.status(404).json({ message: 'Bag not found' });
    }

    if (!bag.isActive || bag.isSoldOut) {
      return res.status(400).json({ message: 'Bag is not available' });
    }

    if (bag.availableQuantity < quantity) {
      return res.status(400).json({ message: 'Not enough quantity available' });
    }

    // Calculate prices
    const totalPrice = bag.discountedPrice * quantity;
    const commission = (totalPrice * bag.partner.commission) / 100;

    // Create order
    const order = new Order({
      customer,
      bag: bagId,
      partner: bag.partner._id,
      quantity,
      totalPrice,
      commission,
      paymentMethod,
      pickupTime: bag.pickupTime.start,
      notes
    });

    await order.save();

    // Update bag available quantity
    bag.availableQuantity -= quantity;
    if (bag.availableQuantity === 0) {
      bag.isSoldOut = true;
      bag.isActive = false;
    }
    await bag.save();

    // Update partner total orders
    await Partner.findByIdAndUpdate(bag.partner._id, {
      $inc: { totalOrders: 1 }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        pickupCode: order.pickupCode,
        totalPrice: order.totalPrice,
        pickupTime: order.pickupTime,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders by partner (partner app)
router.get('/partner', auth, async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let query = { partner: req.partner.id };
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(query)
      .populate('bag', 'title discountedPrice')
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error('Get partner orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (partner only)
router.patch('/:id/status', auth, [
  body('status').isIn(['confirmed', 'ready', 'picked_up', 'cancelled']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const order = await Order.findOne({ _id: req.params.id, partner: req.partner.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['ready', 'cancelled'],
      'ready': ['picked_up'],
      'picked_up': [],
      'cancelled': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify pickup code (partner only)
router.post('/verify-pickup', auth, [
  body('pickupCode').notEmpty().withMessage('Pickup code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickupCode } = req.body;

    const order = await Order.findOne({ 
      pickupCode: pickupCode.toUpperCase(),
      partner: req.partner.id,
      status: 'ready'
    }).populate('bag', 'title');

    if (!order) {
      return res.status(404).json({ message: 'Invalid pickup code or order not ready' });
    }

    order.status = 'picked_up';
    await order.save();

    res.json({ 
      message: 'Pickup verified successfully',
      order: {
        id: order._id,
        customerName: order.customer.name,
        bagTitle: order.bag.title,
        quantity: order.quantity
      }
    });

  } catch (error) {
    console.error('Verify pickup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('bag', 'title discountedPrice')
      .populate('partner', 'businessName address phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
