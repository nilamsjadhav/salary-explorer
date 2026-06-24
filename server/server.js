const express = require("express");
const cors = require("cors");
const employees = require("./data/employees.json");

const app = express();

app.use(cors());

app.get("/api/employees", (req, res) => {
  res.json(employees);
});

if (require.main === module) {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

module.exports = app;