const path = require("path");
const { getDb, closeDb } = require("../../src/database/db");
const { seed } = require("../../src/database/seed");

const DATA_PATH = path.join(__dirname, "..", "..", "src", "data", "fifty_employees.json");

beforeAll(() => {
  getDb(":memory:");
  seed(DATA_PATH);
});

afterAll(() => {
  closeDb();
});

function mockReqRes(query = {}) {
  const req = { query };
  const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  return { req, res };
}

describe("getDashboard", () => {
  const { getDashboard } = require("../../src/routes/dashboard");

  it("should return salary stats", () => {
    const { req, res } = mockReqRes();
    getDashboard(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result).toHaveProperty("averageSalary");
    expect(result).toHaveProperty("highestSalary");
    expect(result).toHaveProperty("lowestSalary");
    expect(result).toHaveProperty("totalPayroll");
  });

  it("should return numeric values", () => {
    const { req, res } = mockReqRes();
    getDashboard(req, res);

    const result = res.json.mock.calls[0][0];
    expect(typeof result.averageSalary).toBe("number");
    expect(typeof result.highestSalary).toBe("number");
    expect(typeof result.lowestSalary).toBe("number");
    expect(typeof result.totalPayroll).toBe("number");
  });

  it("should have highest >= average >= lowest", () => {
    const { req, res } = mockReqRes();
    getDashboard(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.highestSalary).toBeGreaterThanOrEqual(result.averageSalary);
    expect(result.averageSalary).toBeGreaterThanOrEqual(result.lowestSalary);
  });

  it("should return 500 when db throws an error", () => {
    jest.resetModules();
    jest.mock("../../src/database/db", () => ({
      getDb: () => ({
        prepare: () => { throw new Error("DB error"); },
      }),
    }));

    const { getDashboard: handler } = require("../../src/routes/dashboard");
    const { req, res } = mockReqRes();
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch dashboard data" });
  });
});

describe("getDepartmentChart", () => {
  const { getDepartmentChart } = require("../../src/routes/dashboard");

  it("should return department counts", () => {
    const { req, res } = mockReqRes();
    getDepartmentChart(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("department");
    expect(result[0]).toHaveProperty("count");
  });
});

describe("getSalaryChart", () => {
  const { getSalaryChart } = require("../../src/routes/dashboard");

  it("should return salary distribution data", () => {
    const { req, res } = mockReqRes();
    getSalaryChart(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.length).toBe(4);
    expect(result[0]).toHaveProperty("salaryRange");
    expect(result[0]).toHaveProperty("employeeCount");
  });
});

describe("getReports", () => {
  const { getReports } = require("../../src/routes/dashboard");

  it("should return top5HighestPaidEmployees, averageSalaryByDepartment, and payrollByDepartment", () => {
    const { req, res } = mockReqRes();
    getReports(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result).toHaveProperty("top5HighestPaidEmployees");
    expect(result.top5HighestPaidEmployees.length).toBe(5);
    expect(result).toHaveProperty("averageSalaryByDepartment");
    expect(result.averageSalaryByDepartment.length).toBeGreaterThan(0);
    expect(result).toHaveProperty("payrollByDepartment");
    expect(result.payrollByDepartment.length).toBeGreaterThan(0);
  });

  it("should filter by country", () => {
    const { req, res } = mockReqRes({ country: "India" });
    getReports(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.top5HighestPaidEmployees.length).toBeLessThanOrEqual(5);
  });
});
