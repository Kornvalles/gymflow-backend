const sqlite3 = require('sqlite3').verbose();

// Open or create the SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database opened successfully');
  }
});

// Create the Users table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );`,
    (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table created or already exists');
      }
    }
  );
});

module.exports = db;
