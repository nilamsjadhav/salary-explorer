const { getDb, closeDb } = require("../db");
const { seed } = require("../seed");

process.env.DB_PATH = ":memory:";

beforeAll(() => {
  getDb();
  seed();
});

afterAll(() => {
  closeDb();
});

describe("getAllEmployees", () => {
  const { getAllEmployees } = require("./employees");

  it("should return all employees as JSON", () => {
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    getAllEmployees({}, res);

    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    expect(res.json.mock.calls[0][0]).toHaveLength(12);
  });

  it("should return employees with correct structure", () => {
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    getAllEmployees({}, res);

    const employee = res.json.mock.calls[0][0][0];
    expect(employee).toHaveProperty("employeeId");
    expect(employee).toHaveProperty("name");
    expect(employee).toHaveProperty("department");
    expect(employee).toHaveProperty("designation");
    expect(employee).toHaveProperty("location");
    expect(employee).toHaveProperty("country");
    expect(employee).toHaveProperty("currency");
    expect(employee).toHaveProperty("joiningDate");
    expect(employee).toHaveProperty("salary");
  });

  it("should return 500 when db throws an error", () => {
    jest.resetModules();
    jest.mock("../db", () => ({
      getDb: () => ({
        prepare: () => {
          throw new Error("DB error");
        },
      }),
    }));

    const { getAllEmployees: handler } = require("./employees");
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    handler({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch employees" });
  });
});
