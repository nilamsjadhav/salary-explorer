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

function formatRangeLabel(min, max, isLast) {
  const format = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };
  return isLast ? `${format(min)}+` : `${format(min)}-${format(max)}`;
}

function getSalaryDistribution({ currency = "INR" } = {}) {
  const db = getDb();

  const rows = db
    .prepare(`SELECT salary FROM employees WHERE currency = @currency`)
    .all({ currency });

  if (rows.length === 0) {
    return [];
  }

  const salaries = rows.map((r) => r.salary);
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const bucketCount = 4;
  const bucketSize = Math.ceil((max - min + 1) / bucketCount);

  const ranges = [];
  for (let i = 0; i < bucketCount; i++) {
    const rangeMin = min + i * bucketSize;
    const rangeMax = rangeMin + bucketSize;
    const isLast = i === bucketCount - 1;
    ranges.push({
      salaryRange: formatRangeLabel(rangeMin, rangeMax, isLast),
      employeeCount: rows.filter(
        (r) => (isLast ? r.salary >= rangeMin : r.salary >= rangeMin && r.salary < rangeMax)
      ).length,
    });
  }

  return ranges;
}

function getGenderDistribution() {
  const db = getDb();

  return db
    .prepare(
      `SELECT gender, COUNT(*) as count
      FROM employees
      GROUP BY gender
      ORDER BY count DESC`
    )
    .all();
}

function getTop5HighestPaid({ country } = {}) {
  const db = getDb();
  const conditions = [];
  const params = {};

  if (country) {
    conditions.push("country = @country");
    params.country = country;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return db
    .prepare(
      `SELECT employeeId, name, department, designation, salary, currency
      FROM employees ${whereClause}
      ORDER BY salary DESC
      LIMIT 5`
    )
    .all(params);
}

module.exports = { getEmployees, getDashboardStats, getEmployeesByDepartment, getSalaryDistribution, getGenderDistribution, getTop5HighestPaid };
