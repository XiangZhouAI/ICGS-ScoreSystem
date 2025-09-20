const mongoose = require('mongoose');

const holeSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  par: {
    type: Number,
    required: true,
    min: 3,
    max: 5
  },
  strokeIndexMen: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  strokeIndexLadies: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  yardage: {
    blue: Number,    // Championship tees
    white: Number,   // Men's regular tees
    green: Number,   // Forward tees
    red: Number      // Ladies' tees
  }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  holes: [holeSchema],
  totalPar: {
    type: Number,
    required: true,
    default: 72
  },
  sss: {
    type: Object,
    default: {
      men: 72,
      ladies: 74
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total par from holes
courseSchema.pre('save', function(next) {
  if (this.holes && this.holes.length === 18) {
    this.totalPar = this.holes.reduce((sum, hole) => sum + hole.par, 0);
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);