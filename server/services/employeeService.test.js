const { getDb, closeDb } = require("../db");
const { seed } = require("../seed");
const employees = require("../data/fifty_employees.json");

const totalEmployees = employees.length;
const getEmployeeCountByCurrency = (currency) => employees.filter((employee) => employee.currency === currency).length;

process.env.DB_PATH = ":memory:";

beforeAll(() => {
  getDb();
  seed();
});

afterAll(() => {
  closeDb();
});

const { getEmployees, getDashboardStats, getEmployeesByDepartment, getSalaryDistribution, getGenderDistribution, getTop5HighestPaid } = require("./employeeService");

describe("getEmployees", () => {
  it("should return paginated response with all employees", () => {
    const result = getEmployees();
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("page", 1);
    expect(result).toHaveProperty("pageSize", 20);
    expect(result).toHaveProperty("totalRecords", totalEmployees);
    expect(result).toHaveProperty("totalPages", Math.ceil(totalEmployees / 20));
    expect(result.data).toHaveLength(Math.min(totalEmployees, 20));
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
    expect(result.totalPages).toBe(Math.ceil(totalEmployees / 5));
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

describe("getEmployeesByDepartment", () => {
  it("should return department counts", () => {
    const result = getEmployeesByDepartment();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((row) => {
      expect(row).toHaveProperty("department");
      expect(row).toHaveProperty("count");
      expect(row.count).toBeGreaterThan(0);
    });
  });

  it("should be sorted by count descending", () => {
    const result = getEmployeesByDepartment();
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].count).toBeGreaterThanOrEqual(result[i].count);
    }
  });
});

describe("getSalaryDistribution", () => {
  it("should return salary ranges with employee counts for default currency INR", () => {
    const result = getSalaryDistribution();
    expect(result.length).toBe(4);
    result.forEach((row) => {
      expect(row).toHaveProperty("salaryRange");
      expect(row).toHaveProperty("employeeCount");
      expect(typeof row.employeeCount).toBe("number");
    });
  });

  it("should return dynamically generated INR range labels by default", () => {
    const result = getSalaryDistribution();
    expect(result).toHaveLength(4);
    result.forEach((row, index) => {
      expect(typeof row.salaryRange).toBe("string");
      expect(row.salaryRange.length).toBeGreaterThan(0);
      if (index === result.length - 1) {
        expect(row.salaryRange).toMatch(/\+$/);
      } else {
        expect(row.salaryRange).toContain("-");
      }
    });
  });

  it("should filter by currency and return ranges that total the USD employee count", () => {
    const result = getSalaryDistribution({ currency: "USD" });
    expect(result).toHaveLength(4);
    const total = result.reduce((sum, r) => sum + r.employeeCount, 0);
    expect(total).toBe(getEmployeeCountByCurrency("USD"));
  });

  it("should count employees correctly for INR", () => {
    const result = getSalaryDistribution({ currency: "INR" });
    const total = result.reduce((sum, r) => sum + r.employeeCount, 0);
    expect(total).toBe(getEmployeeCountByCurrency("INR"));
  });
});

describe("getGenderDistribution", () => {
  it("should return gender counts", () => {
    const result = getGenderDistribution();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((row) => {
      expect(row).toHaveProperty("gender");
      expect(row).toHaveProperty("count");
      expect(row.count).toBeGreaterThan(0);
    });
  });

  it("should have total count equal to all employees", () => {
    const result = getGenderDistribution();
    const total = result.reduce((sum, r) => sum + r.count, 0);
    expect(total).toBe(totalEmployees);
  });
});

describe("getTop5HighestPaid", () => {
  it("should return 5 employees", () => {
    const result = getTop5HighestPaid();
    expect(result.length).toBe(5);
  });

  it("should be sorted by salary descending", () => {
    const result = getTop5HighestPaid();
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].salary).toBeGreaterThanOrEqual(result[i].salary);
    }
  });

  it("should filter by country", () => {
    const result = getTop5HighestPaid({ country: "India" });
    expect(result.length).toBeLessThanOrEqual(5);
    result.forEach((r) => {
      expect(r.currency).toBe("INR");
    });
  });

  it("should return expected fields", () => {
    const result = getTop5HighestPaid();
    result.forEach((r) => {
      expect(r).toHaveProperty("employeeId");
      expect(r).toHaveProperty("name");
      expect(r).toHaveProperty("department");
      expect(r).toHaveProperty("designation");
      expect(r).toHaveProperty("salary");
      expect(r).toHaveProperty("currency");
    });
  });
});
