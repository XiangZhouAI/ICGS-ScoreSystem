const express = require('express');
const Score = require('../models/Score');
const Course = require('../models/Course');
const { processScorecard, calculatePrizeStats } = require('../utils/stableford');
const router = express.Router();

// GET /api/scores/competition/:competitionId - Get all scores for a competition
router.get('/competition/:competitionId', async (req, res) => {
  try {
    const scores = await Score.find({ competition: req.params.competitionId })
      .populate('player', 'name handicap category')
      .sort({ 'totals.stablefordPoints': -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/scores - Create or update score
router.post('/', async (req, res) => {
  try {
    const { competition, player, holes, playingHandicap } = req.body;
    
    // Get course data and player data for calculations
    const competitionData = await require('../models/Competition')
      .findById(competition)
      .populate('course');
    
    if (!competitionData) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    // Get player data to determine gender
    const playerData = await require('../models/Player').findById(player);
    if (!playerData) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    // Process scorecard with Stableford calculations using player gender
    const processedHoles = processScorecard(holes, playingHandicap, competitionData.course.holes, playerData.gender);
    
    // Find existing score or create new one
    let score = await Score.findOne({ competition, player });
    if (score) {
      score.holes = processedHoles;
      score.lastUpdated = new Date();
    } else {
      score = new Score({
        competition,
        player,
        holes: processedHoles
      });
    }
    
    await score.save();
    await score.populate('player', 'name handicap category');
    res.json(score);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/scores/:id - Update specific score
router.put('/:id', async (req, res) => {
  try {
    const { holes, playingHandicap } = req.body;
    
    const score = await Score.findById(req.params.id).populate({
      path: 'competition',
      populate: { path: 'course' }
    }).populate('player');
    
    if (!score) {
      return res.status(404).json({ error: 'Score not found' });
    }
    
    // Process scorecard with updated data using player gender
    const processedHoles = processScorecard(holes, playingHandicap, score.competition.course.holes, score.player.gender);
    
    score.holes = processedHoles;
    score.lastUpdated = new Date();
    
    await score.save();
    await score.populate('player', 'name handicap category');
    res.json(score);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/scores/leaderboard/:competitionId - Get leaderboard with categories
router.get('/leaderboard/:competitionId', async (req, res) => {
  try {
    const scores = await Score.find({ competition: req.params.competitionId })
      .populate('player', 'name handicap category')
      .sort({ 'totals.stablefordPoints': -1 });
    
    // Group by category
    const leaderboard = {
      overall: scores,
      categoryA: scores.filter(s => s.player.category === 'A'),
      categoryB: scores.filter(s => s.player.category === 'B'),
      categoryC: scores.filter(s => s.player.category === 'C')
    };
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/scores/prizes/:competitionId - Calculate prize winners
router.get('/prizes/:competitionId', async (req, res) => {
  try {
    const scores = await Score.find({ competition: req.params.competitionId })
      .populate('player', 'name handicap category');
    
    const prizeStats = calculatePrizeStats(scores);
    
    // Add overall and category winners
    const leaderboard = {
      categoryA: scores.filter(s => s.player.category === 'A').sort((a, b) => b.totals.stablefordPoints - a.totals.stablefordPoints),
      categoryB: scores.filter(s => s.player.category === 'B').sort((a, b) => b.totals.stablefordPoints - a.totals.stablefordPoints),
      categoryC: scores.filter(s => s.player.category === 'C').sort((a, b) => b.totals.stablefordPoints - a.totals.stablefordPoints)
    };
    
    const prizes = {
      overallWinner: scores.sort((a, b) => b.totals.stablefordPoints - a.totals.stablefordPoints)[0]?.player,
      categoryWinners: {
        A: leaderboard.categoryA[0]?.player,
        B: leaderboard.categoryB[0]?.player,
        C: leaderboard.categoryC[0]?.player
      },
      ...prizeStats
    };
    
    res.json(prizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/scores/live/:competitionId - Live scoring data for 4K display
router.get('/live/:competitionId', async (req, res) => {
  try {
    const scores = await Score.find({ competition: req.params.competitionId })
      .populate('player', 'name handicap category')
      .sort({ 'totals.stablefordPoints': -1 });
    
    const leaderboard = {
      categoryA: scores.filter(s => s.player.category === 'A').slice(0, 5),
      categoryB: scores.filter(s => s.player.category === 'B').slice(0, 5),
      categoryC: scores.filter(s => s.player.category === 'C').slice(0, 5)
    };
    
    const prizes = calculatePrizeStats(scores);
    
    res.json({
      leaderboard,
      prizes,
      lastUpdated: new Date(),
      totalPlayers: scores.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;