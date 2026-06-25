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

describe("getDashboard", () => {
  const { getDashboard } = require("./dashboard");

  function mockReqRes() {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    return { req, res };
  }

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
    jest.mock("../db", () => ({
      getDb: () => ({
        prepare: () => { throw new Error("DB error"); },
      }),
    }));

    const { getDashboard: handler } = require("./dashboard");
    const { req, res } = mockReqRes();
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch dashboard data" });
  });
});

describe("getDepartmentChart", () => {
  const { getDepartmentChart } = require("./dashboard");

  function mockReqRes() {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    return { req, res };
  }

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
  const { getSalaryChart } = require("./dashboard");

  function mockReqRes() {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    return { req, res };
  }

  it("should return salary distribution data", () => {
    const { req, res } = mockReqRes();
    getSalaryChart(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.length).toBe(4);
    expect(result[0]).toHaveProperty("salaryRange");
    expect(result[0]).toHaveProperty("employeeCount");
  });
});

describe("getGenderChart", () => {
  const { getGenderChart } = require("./dashboard");

  function mockReqRes() {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    return { req, res };
  }

  it("should return gender distribution data", () => {
    const { req, res } = mockReqRes();
    getGenderChart(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("gender");
    expect(result[0]).toHaveProperty("count");
  });
});

describe("getReports", () => {
  const { getReports } = require("./dashboard");

  function mockReqRes(query = {}) {
    const req = { query };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    return { req, res };
  }

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
