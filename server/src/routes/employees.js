const { getEmployees } = require("../services/employeeService");

function getAllEmployees(req, res) {
  try {
    const result = getEmployees(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
}

module.exports = { getAllEmployees };