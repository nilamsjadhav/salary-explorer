const Database = require("better-sqlite3");

let db;

function getDb(dbPath) {
  if (!db) {
    if (!dbPath) throw new Error("dbPath is required for first getDb() call");
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
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
  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
