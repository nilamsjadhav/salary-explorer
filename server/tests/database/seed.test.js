const path = require("path");
const { getDb, closeDb } = require("../../src/database/db");
const { seed } = require("../../src/database/seed");

const DATA_PATH = path.join(__dirname, "..", "..", "src", "data", "fifty_employees.json");
const employees = require(DATA_PATH);

describe("database/seed", () => {
  beforeEach(() => {
    getDb(":memory:");
  });

  afterEach(() => {
    closeDb();
  });

  it("should throw if no dataPath provided", () => {
    expect(() => seed()).toThrow("dataPath is required for seed()");
  });

  it("should seed all employees into database", () => {
    seed(DATA_PATH);
    const db = getDb();
    const count = db.prepare("SELECT COUNT(*) as count FROM employees").get();
    expect(count.count).toBe(employees.length);
  });

  it("should skip seeding if data already matches", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    seed(DATA_PATH);
    seed(DATA_PATH);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("already seeded")
    );
    consoleSpy.mockRestore();
  });

  it("should re-seed when data count changes", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    seed(DATA_PATH);

    // Manually insert an extra row to change count
    const db = getDb();
    db.prepare(
      "INSERT INTO employees (employeeId, name, gender, department, designation, location, country, currency, joiningDate, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("EXTRA-001", "Test", "Male", "IT", "Dev", "City", "US", "USD", "2024-01-01", 50000);

    // Re-seed — count mismatch should trigger re-seed
    seed(DATA_PATH);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Re-seeding")
    );

    const count = db.prepare("SELECT COUNT(*) as count FROM employees").get();
    expect(count.count).toBe(employees.length);
    consoleSpy.mockRestore();
  });

  it("should insert correct employee data", () => {
    seed(DATA_PATH);
    const db = getDb();
    const first = db
      .prepare("SELECT * FROM employees WHERE employeeId = ?")
      .get(employees[0].employeeId);

    expect(first.name).toBe(employees[0].name);
    expect(first.department).toBe(employees[0].department);
    expect(first.salary).toBe(employees[0].salary);
  });
});
