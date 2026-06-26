const { buildWhereClause } = require("../../src/utils/buildWhereClause");

describe("buildWhereClause", () => {
  it("should return empty clause when no filters", () => {
    const { clause, params } = buildWhereClause({});
    expect(clause).toBe("");
    expect(params).toEqual({});
  });

  it("should return empty clause when values are undefined/null/empty", () => {
    const { clause, params } = buildWhereClause({ country: undefined, dept: null, name: "" });
    expect(clause).toBe("");
    expect(params).toEqual({});
  });

  it("should build clause for single filter", () => {
    const { clause, params } = buildWhereClause({ country: "India" });
    expect(clause).toBe("WHERE country = @country");
    expect(params).toEqual({ country: "India" });
  });

  it("should build clause for multiple filters", () => {
    const { clause, params } = buildWhereClause({ country: "India", currency: "INR" });
    expect(clause).toBe("WHERE country = @country AND currency = @currency");
    expect(params).toEqual({ country: "India", currency: "INR" });
  });

  it("should skip falsy values but keep valid ones", () => {
    const { clause, params } = buildWhereClause({ country: "India", department: "", currency: "INR" });
    expect(clause).toBe("WHERE country = @country AND currency = @currency");
    expect(params).toEqual({ country: "India", currency: "INR" });
  });

  it("should return empty when called with no arguments", () => {
    const { clause, params } = buildWhereClause();
    expect(clause).toBe("");
    expect(params).toEqual({});
  });
});
