const express = require("express");
const cors = require("cors");
const { getAllEmployees } = require("./routes/employees");
const { getDashboard, getDepartmentChart, getSalaryChart, getGenderChart } = require("./routes/dashboard");

const app = express();

app.use(cors());

app.get("/api/employees", getAllEmployees);
app.get("/api/dashboard", getDashboard);
app.get("/api/dashboard/departments", getDepartmentChart);
app.get("/api/dashboard/salary-distribution", getSalaryChart);
app.get("/api/dashboard/gender", getGenderChart);

module.exports = app;
