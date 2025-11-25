const jwt = require('jsonwebtoken');
const Partner = require('../models/Partner');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const partner = await Partner.findById(decoded.partnerId).select('-password');
    
    if (!partner) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.partner = partner;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
