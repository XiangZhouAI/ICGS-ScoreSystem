const express = require('express');
const Player = require('../models/Player');
const router = express.Router();

// GET /api/players - Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find({ isActive: true }).sort({ name: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/players - Create new player
router.post('/', async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/players/:id - Update player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/players/:id - Soft delete player
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json({ message: 'Player deactivated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/players/categories - Get players grouped by handicap categories
router.get('/categories', async (req, res) => {
  try {
    const players = await Player.find({ isActive: true }).sort({ handicap: 1 });
    
    // Auto-balance categories into three roughly equal groups
    const totalPlayers = players.length;
    const playersPerCategory = Math.ceil(totalPlayers / 3);
    
    const categories = {
      A: players.slice(0, playersPerCategory),
      B: players.slice(playersPerCategory, playersPerCategory * 2),
      C: players.slice(playersPerCategory * 2)
    };
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;