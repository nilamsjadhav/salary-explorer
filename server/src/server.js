const fs = require("fs");
const config = require("./config");
const { getDb, closeDb } = require("./database/db");
const { seed } = require("./database/seed");
const { createApp } = require("./app");

const app = createApp();

if (require.main === module) {
  try {
    // Auto-generate data if file doesn't exist
    if (!fs.existsSync(config.dataPath)) {
      console.log("Data file not found. Generating...");
      const { generate } = require("./database/seedGenerator");
      generate(config.employeeCount, config.dataPath);
    }

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
