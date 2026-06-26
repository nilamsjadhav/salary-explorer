const path = require("path");
const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const { getAllEmployees } = require("./routes/employees");
const { getDashboard, getDepartmentChart, getSalaryChart, getGenderChart, getReports } = require("./routes/dashboard");
const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(
    pinoHttp({
      level: process.env.LOG_LEVEL || "info",
      enabled: process.env.NODE_ENV !== "test",
      transport:
        process.env.NODE_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
          headers: req.headers,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
          headers: res.headers || {},
        }),
      },
    })
  );

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
