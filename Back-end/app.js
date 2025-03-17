const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path'); 
const jwt = require('jsonwebtoken');
const User = require('./app/model/users');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;
const secretKey = process.env.JWT_SECRET_KEY;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "../Front-end")));
app.use(express.json());

// Register route
app.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    
    // Check if the user already exists
    const userExists = await User.findOne({ where: { username: req.body.username } });
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    };

    // Check if the email already exists
    const emailExists = await User.findOne({ where: { email: req.body.email } });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      idadmin: false
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(400).json({ error: err });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);

    // Find the user by username
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(400).json({ error: err });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});