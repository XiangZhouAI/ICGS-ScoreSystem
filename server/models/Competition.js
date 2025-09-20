const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  players: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    playingHandicap: {
      type: Number,
      required: true
    }
  }],
  format: {
    type: String,
    enum: ['Stableford', 'Stroke Play', 'Match Play'],
    default: 'Stableford'
  },
  status: {
    type: String,
    enum: ['Setup', 'Active', 'Completed'],
    default: 'Setup'
  },
  prizeCategories: {
    overallWinner: { enabled: Boolean, default: true },
    categoryWinners: { enabled: Boolean, default: true },
    mostBirdies: { enabled: Boolean, default: true },
    mostBogeys: { enabled: Boolean, default: true },
    mostScratchHoles: { enabled: Boolean, default: true },
    bestPar3Score: { enabled: Boolean, default: true },
    bestIndividualHole: { enabled: Boolean, default: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Competition', competitionSchema);