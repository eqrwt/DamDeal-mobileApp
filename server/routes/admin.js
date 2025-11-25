const express = require('express');
const Order = require('../models/Order');
const Partner = require('../models/Partner');
const Bag = require('../models/Bag');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's orders
    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Total statistics
    const totalOrders = await Order.countDocuments();
    const totalPartners = await Partner.countDocuments({ isActive: true });
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['picked_up', 'ready'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalCommission = await Order.aggregate([
      { $match: { status: { $in: ['picked_up', 'ready'] } } },
      { $group: { _id: null, total: { $sum: '$commission' } } }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('partner', 'businessName')
      .populate('bag', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      todayOrders: todayOrders.length,
      totalOrders,
      totalPartners,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCommission: totalCommission[0]?.total || 0,
      recentOrders
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all partners
router.get('/partners', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (status === 'verified') query.isVerified = true;
    if (status === 'unverified') query.isVerified = false;

    const partners = await Partner.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Partner.countDocuments(query);

    res.json({
      partners,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update partner status
router.patch('/partners/:id/status', async (req, res) => {
  try {
    const { isActive, isVerified } = req.body;

    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    if (isActive !== undefined) partner.isActive = isActive;
    if (isVerified !== undefined) partner.isVerified = isVerified;

    await partner.save();

    res.json({ message: 'Partner status updated', partner });

  } catch (error) {
    console.error('Update partner status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, partner, date, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (partner) query.partner = partner;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(query)
      .populate('partner', 'businessName')
      .populate('bag', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get commission report
router.get('/commission-report', async (req, res) => {
  try {
    const { startDate, endDate, partner } = req.query;
    
    let matchStage = { status: { $in: ['picked_up', 'ready'] } };
    
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (partner) {
      matchStage.partner = partner;
    }

    const commissionData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$partner',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          totalCommission: { $sum: '$commission' }
        }
      },
      {
        $lookup: {
          from: 'partners',
          localField: '_id',
          foreignField: '_id',
          as: 'partner'
        }
      },
      { $unwind: '$partner' },
      {
        $project: {
          partnerName: '$partner.businessName',
          totalOrders: 1,
          totalRevenue: 1,
          totalCommission: 1
        }
      }
    ]);

    const summary = commissionData.reduce((acc, item) => {
      acc.totalOrders += item.totalOrders;
      acc.totalRevenue += item.totalRevenue;
      acc.totalCommission += item.totalCommission;
      return acc;
    }, { totalOrders: 0, totalRevenue: 0, totalCommission: 0 });

    res.json({
      commissionData,
      summary
    });

  } catch (error) {
    console.error('Commission report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get partner details
router.get('/partners/:id', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id).select('-password');
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Get partner's orders
    const orders = await Order.find({ partner: req.params.id })
      .populate('bag', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get partner's bags
    const bags = await Bag.find({ partner: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      partner,
      recentOrders: orders,
      recentBags: bags
    });

  } catch (error) {
    console.error('Get partner details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
