const { getDb } = require("../db");

function getAllEmployees(req, res) {
  try {
    const db = getDb();

    const {
      search,
      department,
      minSalary,
      maxSalary,
      fromDate,
      toDate,
      page = 1,
      pageSize = 20,
    } = req.query;

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

    const employees = db
      .prepare(`SELECT * FROM employees ${whereClause} LIMIT @limit OFFSET @offset`)
      .all({ ...params, limit: size, offset });

    res.json({
      data: employees,
      page: pageNum,
      pageSize: size,
      totalRecords,
      totalPages: Math.ceil(totalRecords / size),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
}

module.exports = { getAllEmployees };