const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api/employees", (req, res) => {
  res.json([
    { id: 1, name: "John" },
    { id: 2, name: "Nilam" }
  ]);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});