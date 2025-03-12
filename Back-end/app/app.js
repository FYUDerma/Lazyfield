const express = require('express');
const auth = require('./routes/auth');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

app.use('/', auth);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});