const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  bag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bag',
    required: true
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  commission: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ready', 'picked_up', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'kaspi', 'halyk'],
    default: 'card'
  },
  pickupCode: {
    type: String,
    required: true,
    unique: true
  },
  pickupTime: {
    type: Date,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

// Generate pickup code before saving
orderSchema.pre('save', function(next) {
  if (!this.pickupCode) {
    this.pickupCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

// Index for efficient queries
orderSchema.index({ 'partner': 1, 'status': 1 });

module.exports = mongoose.model('Order', orderSchema);
