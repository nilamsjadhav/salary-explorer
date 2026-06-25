const Database = require("better-sqlite3");
const path = require("path");

let db;

function getDbPath() {
  return process.env.DB_PATH || path.join(__dirname, "data", "employees.db");
}

function getDb() {
  if (!db) {
    db = new Database(getDbPath());
    db.pragma("journal_mode = WAL");
    createTable();
  }
  return db;
}

function createTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      employeeId TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      gender TEXT,
      department TEXT NOT NULL,
      designation TEXT NOT NULL,
      location TEXT NOT NULL,
      country TEXT NOT NULL,
      currency TEXT NOT NULL,
      joiningDate TEXT NOT NULL,
      salary REAL NOT NULL
    )
  `);
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
