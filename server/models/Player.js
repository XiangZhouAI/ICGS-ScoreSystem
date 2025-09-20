const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  handicap: {
    type: Number,
    required: true,
    min: 0,
    max: 54
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  category: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-calculate category based on handicap
playerSchema.pre('save', function(next) {
  if (this.handicap <= 9) {
    this.category = 'A';
  } else if (this.handicap <= 15) {
    this.category = 'B';
  } else {
    this.category = 'C';
  }
  next();
});

module.exports = mongoose.model('Player', playerSchema);