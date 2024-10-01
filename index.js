const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Function for checking if the user exists
const checkUser = (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const doubleHashedPassword = await bcrypt.hash(hashedPassword, 10);

  // Check if email already exists
  const existingUser = await checkUser(email);

  if (existingUser) {
    return res.status(409).send('Email already in use');
  }

  // Insert new user into the database
  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;

  db.run(query, [email, doubleHashedPassword], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error registering user');
    }

    return res.status(201).send({ id: this.lastID });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  // Check if user exists in the database
  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching user');
    }

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error checking password');
      }

      if (!isMatch) {
        return res.status(401).send('Incorrect password');
      }

      return res.status(200).send('Login successful');
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
