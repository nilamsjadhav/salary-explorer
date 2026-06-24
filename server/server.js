const { getDb, closeDb } = require("./db");
const { seed } = require("./seed");
const app = require("./app");

if (require.main === module) {
  try {
    getDb();
    seed();
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }

  process.on("SIGINT", () => {
    closeDb();
    process.exit(0);
  });
}

module.exports = app;