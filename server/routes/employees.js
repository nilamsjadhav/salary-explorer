const { getDb } = require("../db");

function getAllEmployees(req, res) {
  try {
    const db = getDb();
    const employees = db.prepare("SELECT * FROM employees").all();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
}

module.exports = { getAllEmployees };