const path = require("path");

const config = {
  port: process.env.PORT || 5000,
  dbPath: process.env.DB_PATH || path.join(__dirname, "..", "data", "employees.db"),
  dataPath: process.env.DATA_PATH || path.join(__dirname, "..", "data", "fifty_employees.json"),
};

module.exports = config;
