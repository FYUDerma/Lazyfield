const express = require('express');
const User = require("../model/users");
const GameState = require("../model/gameState");
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Save progress
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { username, clicks, upgrades, clickMultiplier } = req.body;

    // Find the user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete any existing game state for the user
    await GameState.destroy({ where: { userid: user.userid } });

    // Find or Create the game state
    const [gameState, created] = await GameState.create({
      userid: user.userid,
      clicks,
      upgrades,
      clickMultiplier,
      lastSaved: new Date()
  });

    // Update the game state if it already exists
    if (!created) {
      gameState.clicks = clicks;
      gameState.upgrades = upgrades;
      gameState.clickMultiplier = clickMultiplier;  
      gameState.lastSaved = new Date();
      await gameState.save();
    }

    res.status(200).json({ message: 'Progress saved successfully' });
  } catch (err) {
    console.error('Error during save:', err);
    res.status(400).json({ error: err });
  }
});

// Load progress
router.get("/load/:username", authenticateToken, async (req, res) => {
  try {
    // Find the user
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    };

    // Find the user's game progress
    const gameState = await GameState.findOne({ where: { userid: user.userid } });
    if (!gameState) {
      return res.status(404).json({ error: 'Progress not found' });
    };

    res.status(200).json({ gameState });
  } catch (err) {
    console.error('Error during load:', err);
    res.status(400).json({ error: err }); 
  }
});

// Reset progress
router.post("/reset", authenticateToken, async (req, res) => {
  try {
    // Find the user
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    };

    // Find the user's game progress
    const gameState = await GameState.findOne({ where: { userid: user.userid } });
    if (!gameState) {
      return res.status(404).json({ error: 'Progress not found' });
    };

    // Reset the game state
    gameState.clicks = 0;
    gameState.upgrades = {};
    gameState.lastSaved = new Date();
    await gameState.save();
    res.status(200).json({ message: 'Progress reset successfully' });
  } catch (err) {
    console.error('Error during reset:', err);
    res.status(400).json({ error: err });
  }
});

module.exports = router;