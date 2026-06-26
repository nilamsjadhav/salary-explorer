const path = require("path");
const express = require("express");
const cors = require("cors");
const { getAllEmployees } = require("./routes/employees");
const { getDashboard, getDepartmentChart, getSalaryChart, getGenderChart, getReports } = require("./routes/dashboard");
const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(cors());

  app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/api/employees", getAllEmployees);
  app.get("/api/dashboard", getDashboard);
  app.get("/api/dashboard/departments", getDepartmentChart);
  app.get("/api/dashboard/salary-distribution", getSalaryChart);
  app.get("/api/dashboard/gender", getGenderChart);
  app.get("/api/dashboard/reports", getReports);

  // Serve React build in production
  const clientBuild = path.join(__dirname, "..", "..", "client", "build");
  app.use(express.static(clientBuild));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
