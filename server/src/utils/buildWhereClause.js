function buildWhereClause(filters = {}) {
  const conditions = [];
  const params = {};

  for (const [column, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      conditions.push(`${column} = @${column}`);
      params[column] = value;
    }
  }

  const clause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { clause, params };
}

module.exports = { buildWhereClause };
