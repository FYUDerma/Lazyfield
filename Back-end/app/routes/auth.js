const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/users');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    };

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;