const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/users');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;

// Register route
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);

    const userExists = await User.findOne({ where: { username: req.body.username } });
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const emailExists = await User.findOne({ where: { email: req.body.email } });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      idadmin: false,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(400).json({ error: err });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);

    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(400).json({ error: err });
  }
});

module.exports = router;