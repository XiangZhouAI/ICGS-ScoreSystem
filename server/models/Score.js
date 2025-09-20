const mongoose = require('mongoose');

const holeScoreSchema = new mongoose.Schema({
  hole: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  strokes: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  par: {
    type: Number,
    required: true
  },
  strokeIndex: {
    type: Number,
    required: true
  },
  playingHandicap: {
    type: Number,
    required: true
  },
  netStrokes: {
    type: Number,
    required: true
  },
  stablefordPoints: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  }
}, { _id: false });

const scoreSchema = new mongoose.Schema({
  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  holes: [holeScoreSchema],
  totals: {
    grossScore: {
      type: Number,
      default: 0
    },
    netScore: {
      type: Number,
      default: 0
    },
    stablefordPoints: {
      type: Number,
      default: 0
    },
    outScore: {
      type: Number,
      default: 0
    },
    inScore: {
      type: Number,
      default: 0
    },
    birdies: {
      type: Number,
      default: 0
    },
    bogeys: {
      type: Number,
      default: 0
    },
    pars: {
      type: Number,
      default: 0
    },
    eagles: {
      type: Number,
      default: 0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate totals when saving
scoreSchema.pre('save', function(next) {
  if (this.holes && this.holes.length > 0) {
    this.totals.grossScore = this.holes.reduce((sum, hole) => sum + hole.strokes, 0);
    this.totals.netScore = this.holes.reduce((sum, hole) => sum + hole.netStrokes, 0);
    this.totals.stablefordPoints = this.holes.reduce((sum, hole) => sum + hole.stablefordPoints, 0);
    
    // Calculate out (holes 1-9) and in (holes 10-18)
    this.totals.outScore = this.holes
      .filter(hole => hole.hole <= 9)
      .reduce((sum, hole) => sum + hole.strokes, 0);
    this.totals.inScore = this.holes
      .filter(hole => hole.hole >= 10)
      .reduce((sum, hole) => sum + hole.strokes, 0);
    
    // Calculate scoring statistics
    this.totals.birdies = this.holes.filter(hole => 
      hole.strokes < hole.par).length;
    this.totals.bogeys = this.holes.filter(hole => 
      hole.strokes === hole.par + 1).length;
    this.totals.pars = this.holes.filter(hole => 
      hole.strokes === hole.par).length;
    this.totals.eagles = this.holes.filter(hole => 
      hole.strokes <= hole.par - 2).length;
  }
  
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Score', scoreSchema);