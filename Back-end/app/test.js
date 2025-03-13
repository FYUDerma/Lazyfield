const client = require('./config/database');
const User = require('./model/users');

async function runTests() {
  try {
    // Output the database environment variables
    console.log(client.config.username);
    console.log(client.config.host);
    console.log(client.config.database);
    console.log(client.config.password);
    console.log(client.config.port);

    
    let users = await User.findAll();
    // Add a user
    await User.create({
      username: 'test',
      password: 'test',
      email: 'test@lazyfield.com',
      carot: 0,
      isadmin: false
    });
    users = await User.findAll();
    console.log("Test 1: Adding a users");
    console.log(users);
    console.log("====================================");
    // Output the users table
    console.log("====================================");
    console.log("Test 2: Output the users table");
    console.log(users);
    console.log("====================================");
  } catch (err) {
    console.error(err);
  }
}

runTests();