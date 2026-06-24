const express = require("express");
const cors = require("cors");
const { getAllEmployees } = require("./routes/employees");

const app = express();

app.use(cors());

app.get("/api/employees", getAllEmployees);

module.exports = app;
