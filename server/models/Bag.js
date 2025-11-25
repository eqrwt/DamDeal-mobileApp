const mongoose = require('mongoose');

const bagSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  pickupTime: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSoldOut: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['bakery', 'restaurant', 'cafe', 'grocery', 'other'],
    default: 'other'
  },
  tags: [String],
  image: String
}, {
  timestamps: true
});

// Index for location-based queries
bagSchema.index({ 'partner': 1, 'isActive': 1, 'isSoldOut': 1 });

module.exports = mongoose.model('Bag', bagSchema);
