const fs = require("fs");
const path = require("path");
const { generate } = require("../../src/database/seedGenerator");

const OUTPUT_PATH = path.join(__dirname, "test_employees.json");

describe("seedGenerator", () => {
  afterEach(() => {
    if (fs.existsSync(OUTPUT_PATH)) {
      fs.unlinkSync(OUTPUT_PATH);
    }
  });

  it("should generate the specified number of employees", () => {
    generate(50, OUTPUT_PATH);
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    expect(data).toHaveLength(50);
  });

  it("should create a valid JSON file", () => {
    generate(10, OUTPUT_PATH);
    expect(() => JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"))).not.toThrow();
  });

  it("should generate employees with correct structure", () => {
    generate(5, OUTPUT_PATH);
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    const emp = data[0];

    expect(emp).toHaveProperty("employeeId");
    expect(emp).toHaveProperty("name");
    expect(emp).toHaveProperty("gender");
    expect(emp).toHaveProperty("department");
    expect(emp).toHaveProperty("designation");
    expect(emp).toHaveProperty("location");
    expect(emp).toHaveProperty("country");
    expect(emp).toHaveProperty("currency");
    expect(emp).toHaveProperty("joiningDate");
    expect(emp).toHaveProperty("salary");
  });

  it("should generate sequential employee IDs", () => {
    generate(5, OUTPUT_PATH);
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    expect(data[0].employeeId).toBe("EMP0001");
    expect(data[4].employeeId).toBe("EMP0005");
  });

  it("should generate valid genders", () => {
    generate(100, OUTPUT_PATH);
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    data.forEach((emp) => {
      expect(["male", "female"]).toContain(emp.gender);
    });
  });

  it("should generate valid joining dates", () => {
    generate(20, OUTPUT_PATH);
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    data.forEach((emp) => {
      const date = new Date(emp.joiningDate);
      expect(date.toString()).not.toBe("Invalid Date");
      expect(date.getFullYear()).toBeGreaterThanOrEqual(2015);
    });
  });

  it("should generate positive salaries", () => {
    generate(50, OUTPUT_PATH);
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    data.forEach((emp) => {
      expect(emp.salary).toBeGreaterThan(0);
      expect(emp.salary % 1000).toBe(0);
    });
  });

  it("should cover multiple departments", () => {
    generate(200, OUTPUT_PATH);
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    const departments = new Set(data.map((e) => e.department));
    expect(departments.size).toBeGreaterThan(5);
  });

  it("should cover multiple countries", () => {
    generate(200, OUTPUT_PATH);
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    const countries = new Set(data.map((e) => e.country));
    expect(countries.size).toBeGreaterThan(5);
  });
});
