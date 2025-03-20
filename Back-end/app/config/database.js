const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

"Initialize Database environment variables"
const user = process.env.Lazyfield_DATABASE_USER;
const host = process.env.Lazyfield_DATABASE_HOST;
const database = process.env.Lazyfield_DATABASE_NAME;
const password = process.env.Lazyfield_DATABASE_PASSWORD;
const port = process.env.Lazyfield_DATABASE_PORT;

"Create a new client"
const client = new Sequelize(
  database,
  user,
  password,
  {
    host: host,
    port: port,
    dialect: 'postgres',
    logging: false,
  }
);


"Connect to the database"
client
  .authenticate()
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.log("Error connecting to the database: ", error));

"Export the client"
module.exports = client;