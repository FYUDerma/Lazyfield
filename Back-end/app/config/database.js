const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

"Initialize Database environment variables"
const user = process.env.Lazyfield_DATABASE_USER;
const host = process.env.Lazyfield_DATABASE_HOST;
const database = process.env.Lazyfield_DATABASE_NAME;
const password = process.env.Lazyfield_DATABASE_PASSWORD;
const port = process.env.Lazyfield_DATABASE_PORT;

"Create a new client"
const client = new Client({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

"Connect to the database"
client.connect(function(err) {
  if (err) {
    throw err;
  } else {
    console.log('Connected to database');
  }
});

"Export the client"
module.exports = client;