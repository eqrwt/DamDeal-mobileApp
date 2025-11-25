const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  businessName: {
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
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: {
      type: String,
      default: 'Almaty'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    bin: String // Business Identification Number for Kazakhstan
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 15 // 15% commission
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Partner', partnerSchema);
