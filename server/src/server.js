const config = require("./config");
const { getDb, closeDb } = require("./database/db");
const { seed } = require("./database/seed");
const { createApp } = require("./app");

const app = createApp();

if (require.main === module) {
  try {
    getDb(config.dbPath);
    seed(config.dataPath);
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
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
