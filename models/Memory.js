const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  partnerName: {
    type: String,
    required: true,
    trim: true
  },
  creatorName: {
    type: String,
    required: true,
    trim: true
  },
  specialDate: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String
  }],
  theme: {
    type: String,
    enum: ['romantico', 'moderno', 'fofo', 'minimalista'],
    default: 'romantico'
  },
  customUrl: {
    type: String,
    unique: true,
    sparse: true
  },
  qrCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Memory', memorySchema); 