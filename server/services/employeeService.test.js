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

const { getEmployees, getDashboardStats } = require("./employeeService");

describe("getEmployees", () => {
  it("should return paginated response with all employees", () => {
    const result = getEmployees();
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("page", 1);
    expect(result).toHaveProperty("pageSize", 20);
    expect(result).toHaveProperty("totalRecords", 12);
    expect(result).toHaveProperty("totalPages", 1);
    expect(result.data).toHaveLength(12);
  });

  it("should filter by search term", () => {
    const result = getEmployees({ search: "India" });
    expect(result.totalRecords).toBeGreaterThan(0);
    result.data.forEach((emp) => {
      expect(emp.country).toBe("India");
    });
  });

  it("should filter by department", () => {
    const result = getEmployees({ department: "Engineering" });
    result.data.forEach((emp) => {
      expect(emp.department).toBe("Engineering");
    });
  });

  it("should filter by currency", () => {
    const result = getEmployees({ currency: "USD" });
    expect(result.totalRecords).toBeGreaterThan(0);
    result.data.forEach((emp) => {
      expect(emp.currency).toBe("USD");
    });
  });

  it("should filter by salary range", () => {
    const result = getEmployees({ minSalary: "1000000", maxSalary: "3000000" });
    result.data.forEach((emp) => {
      expect(emp.salary).toBeGreaterThanOrEqual(1000000);
      expect(emp.salary).toBeLessThanOrEqual(3000000);
    });
  });

  it("should filter by joining date range", () => {
    const result = getEmployees({ fromDate: "2021-01-01", toDate: "2021-12-31" });
    expect(result.totalRecords).toBeGreaterThan(0);
    result.data.forEach((emp) => {
      expect(emp.joiningDate >= "2021-01-01").toBe(true);
      expect(emp.joiningDate <= "2021-12-31").toBe(true);
    });
  });

  it("should paginate results", () => {
    const result = getEmployees({ page: "1", pageSize: "5" });
    expect(result.data.length).toBeLessThanOrEqual(5);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(5);
    expect(result.totalPages).toBe(Math.ceil(12 / 5));
  });
});

describe("getDashboardStats", () => {
  it("should return salary statistics", () => {
    const stats = getDashboardStats();
    expect(stats).toHaveProperty("averageSalary");
    expect(stats).toHaveProperty("highestSalary");
    expect(stats).toHaveProperty("lowestSalary");
    expect(stats).toHaveProperty("totalPayroll");
  });

  it("should return numeric values", () => {
    const stats = getDashboardStats();
    expect(typeof stats.averageSalary).toBe("number");
    expect(typeof stats.highestSalary).toBe("number");
    expect(typeof stats.lowestSalary).toBe("number");
    expect(typeof stats.totalPayroll).toBe("number");
  });

  it("should have highest >= average >= lowest", () => {
    const stats = getDashboardStats();
    expect(stats.highestSalary).toBeGreaterThanOrEqual(stats.averageSalary);
    expect(stats.averageSalary).toBeGreaterThanOrEqual(stats.lowestSalary);
  });

  it("should filter stats by currency", () => {
    const stats = getDashboardStats({ currency: "INR" });
    expect(stats.totalPayroll).toBeGreaterThan(0);
    const allStats = getDashboardStats();
    expect(stats.totalPayroll).toBeLessThanOrEqual(allStats.totalPayroll);
  });
});
