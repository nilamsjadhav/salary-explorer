const { getDb } = require("../db");

function getDashboard(req, res) {
  try {
    const db = getDb();
    const stats = db
      .prepare(
        `SELECT 
          ROUND(AVG(salary), 2) as averageSalary,
          MAX(salary) as highestSalary,
          MIN(salary) as lowestSalary,
          SUM(salary) as totalPayroll
        FROM employees`
      )
      .get();

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}

module.exports = { getDashboard };
