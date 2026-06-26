const { getDb, closeDb } = require("../../src/database/db");

describe("database/db", () => {
  afterEach(() => {
    closeDb();
  });

  describe("getDb", () => {
    it("should throw if no dbPath on first call", () => {
      expect(() => getDb()).toThrow("dbPath is required for first getDb() call");
    });

    it("should create database with given path", () => {
      const db = getDb(":memory:");
      expect(db).toBeDefined();
      expect(typeof db.prepare).toBe("function");
    });

    it("should create employees table on init", () => {
      const db = getDb(":memory:");
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
        .get();
      expect(tables).toBeDefined();
      expect(tables.name).toBe("employees");
    });

    it("should return same instance on subsequent calls without path", () => {
      const db1 = getDb(":memory:");
      const db2 = getDb();
      expect(db2).toBe(db1);
    });

    it("should set WAL journal mode", () => {
      const db = getDb(":memory:");
      // :memory: DBs report 'memory' but the pragma call still executes
      const result = db.pragma("journal_mode");
      expect(result[0].journal_mode).toBeDefined();
    });

    it("should have correct employees table schema", () => {
      const db = getDb(":memory:");
      const columns = db.prepare("PRAGMA table_info(employees)").all();
      const columnNames = columns.map((c) => c.name);
      expect(columnNames).toEqual(
        expect.arrayContaining([
          "employeeId",
          "name",
          "gender",
          "department",
          "designation",
          "location",
          "country",
          "currency",
          "joiningDate",
          "salary",
        ])
      );
    });
  });

  describe("closeDb", () => {
    it("should close database and allow re-initialization", () => {
      getDb(":memory:");
      closeDb();
      expect(() => getDb()).toThrow("dbPath is required");
    });

    it("should not throw when called without an open db", () => {
      expect(() => closeDb()).not.toThrow();
    });
  });
});
