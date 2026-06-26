const path = require("path");

const config = {
  port: process.env.PORT || 5000,
  dbPath: process.env.DB_PATH || path.join(__dirname, "..", "data", "employees.db"),
  dataPath: process.env.DATA_PATH || path.join(__dirname, "..", "data", "employees.json"),
  employeeCount: parseInt(process.env.EMPLOYEE_COUNT || "10000", 10),
};

module.exports = config;
