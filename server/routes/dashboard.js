const { getDashboardStats, getEmployeesByDepartment, getSalaryDistribution } = require("../services/employeeService");

function getDashboard(req, res) {
  try {
    const stats = getDashboardStats(req.query);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}

function getDepartmentChart(req, res) {
  try {
    const data = getEmployeesByDepartment();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch department data" });
  }
}

function getSalaryChart(req, res) {
  try {
    const data = getSalaryDistribution(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch salary distribution" });
  }
}

module.exports = { getDashboard, getDepartmentChart, getSalaryChart };
