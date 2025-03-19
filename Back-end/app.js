const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Routes
const userRoutes = require('./app/routes/userRoutes');
const stateRoutes = require('./app/routes/stateRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "../Front-end")));
app.use(express.json());

// Use routes
// Register and login routes
app.use('/api/users', userRoutes);
// Game progress routes
app.use('/api/state', stateRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});