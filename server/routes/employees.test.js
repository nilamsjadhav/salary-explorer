const { getDb, closeDb } = require("../db");
const { seed } = require("../seed");
const employees = require("../data/fifty_employees.json");

const totalEmployees = employees.length;

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

  function mockReqRes(query = {}) {
    const req = { query };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    return { req, res };
  }

  it("should return paginated response structure", () => {
    const { req, res } = mockReqRes();
    getAllEmployees(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("page", 1);
    expect(result).toHaveProperty("pageSize", 20);
    expect(result).toHaveProperty("totalRecords", totalEmployees);
    expect(result).toHaveProperty("totalPages", Math.ceil(totalEmployees / 20));
  });

  it("should return employees with correct structure", () => {
    const { req, res } = mockReqRes();
    getAllEmployees(req, res);

    const employee = res.json.mock.calls[0][0].data[0];
    expect(employee).toHaveProperty("employeeId");
    expect(employee).toHaveProperty("name");
    expect(employee).toHaveProperty("department");
    expect(employee).toHaveProperty("salary");
    expect(employee).toHaveProperty("country");
    expect(employee).toHaveProperty("currency");
  });

  it("should filter by search term", () => {
    const { req, res } = mockReqRes({ search: "India" });
    getAllEmployees(req, res);

    const result = res.json.mock.calls[0][0];
    result.data.forEach((emp) => {
      expect(emp.country).toBe("India");
    });
    expect(result.totalRecords).toBeGreaterThan(0);
  });

  it("should filter by department", () => {
    const { req, res } = mockReqRes({ department: "Engineering" });
    getAllEmployees(req, res);

    const result = res.json.mock.calls[0][0];
    result.data.forEach((emp) => {
      expect(emp.department).toBe("Engineering");
    });
  });

  it("should filter by currency", () => {
    const { req, res } = mockReqRes({ currency: "USD" });
    getAllEmployees(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.totalRecords).toBeGreaterThan(0);
    result.data.forEach((emp) => {
      expect(emp.currency).toBe("USD");
    });
  });

  it("should filter by salary range", () => {
    const { req, res } = mockReqRes({ minSalary: "1000000", maxSalary: "3000000" });
    getAllEmployees(req, res);

    const result = res.json.mock.calls[0][0];
    result.data.forEach((emp) => {
      expect(emp.salary).toBeGreaterThanOrEqual(1000000);
      expect(emp.salary).toBeLessThanOrEqual(3000000);
    });
  });

  it("should filter by joining date range", () => {
    const { req, res } = mockReqRes({ fromDate: "2021-01-01", toDate: "2021-12-31" });
    getAllEmployees(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.totalRecords).toBeGreaterThan(0);
    result.data.forEach((emp) => {
      expect(emp.joiningDate >= "2021-01-01").toBe(true);
      expect(emp.joiningDate <= "2021-12-31").toBe(true);
    });
  });

  it("should paginate results", () => {
    const { req, res } = mockReqRes({ page: "1", pageSize: "5" });
    getAllEmployees(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.data.length).toBeLessThanOrEqual(5);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(5);
    expect(result.totalPages).toBe(Math.ceil(totalEmployees / 5));
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
    const { req, res } = mockReqRes();
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch employees" });
  });
});
