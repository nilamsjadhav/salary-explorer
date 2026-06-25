const { getDb } = require("../db");

function getEmployees({ search, department, currency, minSalary, maxSalary, fromDate, toDate, page = 1, pageSize = 20 } = {}) {
  const db = getDb();

  const conditions = [];
  const params = {};

  if (search) {
    conditions.push(
      `(name LIKE @search OR employeeId LIKE @search OR designation LIKE @search OR location LIKE @search OR country LIKE @search)`
    );
    params.search = `%${search}%`;
  }

  if (department) {
    conditions.push("department = @department");
    params.department = department;
  }

  if (currency) {
    conditions.push("currency = @currency");
    params.currency = currency;
  }

  if (minSalary) {
    conditions.push("salary >= @minSalary");
    params.minSalary = Number(minSalary);
  }

  if (maxSalary) {
    conditions.push("salary <= @maxSalary");
    params.maxSalary = Number(maxSalary);
  }

  if (fromDate) {
    conditions.push("joiningDate >= @fromDate");
    params.fromDate = fromDate;
  }

  if (toDate) {
    conditions.push("joiningDate <= @toDate");
    params.toDate = toDate;
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const pageNum = Math.max(1, parseInt(page));
  const size = Math.max(1, Math.min(100, parseInt(pageSize)));
  const offset = (pageNum - 1) * size;

  const countRow = db
    .prepare(`SELECT COUNT(*) as total FROM employees ${whereClause}`)
    .get(params);
  const totalRecords = countRow.total;

  const data = db
    .prepare(`SELECT * FROM employees ${whereClause} LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit: size, offset });

  return {
    data,
    page: pageNum,
    pageSize: size,
    totalRecords,
    totalPages: Math.ceil(totalRecords / size),
  };
}

function getDashboardStats({ currency } = {}) {
  const db = getDb();

  const whereClause = currency ? "WHERE currency = @currency" : "";
  const params = currency ? { currency } : {};

  return db
    .prepare(
      `SELECT 
        ROUND(AVG(salary), 2) as averageSalary,
        MAX(salary) as highestSalary,
        MIN(salary) as lowestSalary,
        SUM(salary) as totalPayroll
      FROM employees ${whereClause}`
    )
    .get(params);
}

function getEmployeesByDepartment() {
  const db = getDb();

  return db
    .prepare(
      `SELECT department, COUNT(*) as count
      FROM employees
      GROUP BY department
      ORDER BY count DESC`
    )
    .all();
}

function getSalaryDistribution() {
  const db = getDb();

  const rows = db
    .prepare(
      `SELECT salary FROM employees`
    )
    .all();

  const ranges = [
    { min: 0, max: 1000000, label: "0-10 LPA" },
    { min: 1000000, max: 2000000, label: "10-20 LPA" },
    { min: 2000000, max: 3000000, label: "20-30 LPA" },
    { min: 3000000, max: Infinity, label: "30+ LPA" },
  ];

  return ranges.map(({ min, max, label }) => ({
    salaryRange: label,
    employeeCount: rows.filter((r) => r.salary >= min && r.salary < max).length,
  }));
}

module.exports = { getEmployees, getDashboardStats, getEmployeesByDepartment };
