const express = require('express');
const Partner = require('../models/Partner');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current partner profile
router.get('/me', auth, async (req, res) => {
	try {
		res.json(req.partner);
	} catch (error) {
		console.error('Get me error:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

// Update current partner profile
router.put('/me', auth, async (req, res) => {
	try {
		const allowed = ['businessName', 'phone', 'address', 'bankDetails'];
		const updates = {};
		for (const key of allowed) {
			if (req.body[key] !== undefined) updates[key] = req.body[key];
		}

		const partner = await Partner.findByIdAndUpdate(
			req.partner.id,
			{ $set: updates },
			{ new: true }
		).select('-password');

		res.json(partner);
	} catch (error) {
		console.error('Update me error:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

// Public partner info (limited)
router.get('/:id', async (req, res) => {
	try {
		const partner = await Partner.findById(req.params.id)
			.select('businessName address rating totalOrders');
		if (!partner) return res.status(404).json({ message: 'Partner not found' });
		res.json(partner);
	} catch (error) {
		console.error('Get partner error:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
