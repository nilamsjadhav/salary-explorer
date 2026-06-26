const path = require("path");

describe("config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should return default port 5000", () => {
    delete process.env.PORT;
    const config = require("../../src/config");
    expect(config.port).toBe(5000);
  });

  it("should use PORT from environment", () => {
    process.env.PORT = "8080";
    const config = require("../../src/config");
    expect(config.port).toBe("8080");
  });

  it("should return default dbPath pointing to data directory", () => {
    delete process.env.DB_PATH;
    const config = require("../../src/config");
    expect(config.dbPath).toBe(
      path.join(__dirname, "..", "..", "src", "data", "employees.db")
    );
  });

  it("should use DB_PATH from environment", () => {
    process.env.DB_PATH = "/custom/path.db";
    const config = require("../../src/config");
    expect(config.dbPath).toBe("/custom/path.db");
  });

  it("should return default dataPath pointing to JSON file", () => {
    delete process.env.DATA_PATH;
    const config = require("../../src/config");
    expect(config.dataPath).toContain("fifty_employees.json");
  });

  it("should use DATA_PATH from environment", () => {
    process.env.DATA_PATH = "/custom/data.json";
    const config = require("../../src/config");
    expect(config.dataPath).toBe("/custom/data.json");
  });
});
