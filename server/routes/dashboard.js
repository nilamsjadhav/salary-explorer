const { getDashboardStats } = require("../services/employeeService");

function getDashboard(req, res) {
  try {
    const stats = getDashboardStats(req.query);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}

module.exports = { getDashboard };
