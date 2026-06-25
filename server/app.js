const express = require("express");
const cors = require("cors");
const { getAllEmployees } = require("./routes/employees");
const { getDashboard, getDepartmentChart } = require("./routes/dashboard");

const app = express();

app.use(cors());

app.get("/api/employees", getAllEmployees);
app.get("/api/dashboard", getDashboard);
app.get("/api/dashboard/departments", getDepartmentChart);

module.exports = app;
