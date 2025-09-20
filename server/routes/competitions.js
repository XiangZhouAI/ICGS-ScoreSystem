const express = require('express');
const Competition = require('../models/Competition');
const router = express.Router();

// GET /api/competitions - Get all competitions
router.get('/', async (req, res) => {
  try {
    const competitions = await Competition.find()
      .populate('course', 'name location')
      .populate('players.player', 'name handicap category')
      .sort({ date: -1 });
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/competitions - Create new competition
router.post('/', async (req, res) => {
  try {
    const competition = new Competition(req.body);
    await competition.save();
    await competition.populate('course', 'name location');
    await competition.populate('players.player', 'name handicap category');
    res.status(201).json(competition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/competitions/:id - Get competition by ID
router.get('/:id', async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id)
      .populate('course')
      .populate('players.player', 'name handicap category');
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.json(competition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/competitions/:id - Update competition
router.put('/:id', async (req, res) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('course', 'name location')
     .populate('players.player', 'name handicap category');
    
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.json(competition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/competitions/:id/start - Start competition (change status to Active)
router.post('/:id/start', async (req, res) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      req.params.id, 
      { status: 'Active' }, 
      { new: true }
    ).populate('course')
     .populate('players.player', 'name handicap category');
    
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.json(competition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/competitions/:id/complete - Complete competition
router.post('/:id/complete', async (req, res) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      req.params.id, 
      { status: 'Completed' }, 
      { new: true }
    ).populate('course')
     .populate('players.player', 'name handicap category');
    
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.json(competition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;