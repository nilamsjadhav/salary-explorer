const { getDb } = require("./db");

function seed(dataPath) {
  if (!dataPath) throw new Error("dataPath is required for seed()");
  const employees = require(dataPath);
  const db = getDb();

  const count = db.prepare("SELECT COUNT(*) as count FROM employees").get();

  if (count.count === employees.length) {
    console.log(`Database already seeded with ${count.count} employees. Skipping.`);
    return;
  }

  if (count.count > 0) {
    console.log(`Data count changed (${count.count} → ${employees.length}). Re-seeding...`);
    db.prepare("DELETE FROM employees").run();
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO employees (employeeId, name, gender, department, designation, location, country, currency, joiningDate, salary)
    VALUES (@employeeId, @name, @gender, @department, @designation, @location, @country, @currency, @joiningDate, @salary)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(item);
    }
  });

  insertMany(employees);
  console.log(`Seeded ${employees.length} employees into database.`);
}

module.exports = { seed };
