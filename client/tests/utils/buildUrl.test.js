import { buildUrl } from "../../src/utils/buildUrl";

describe("buildUrl", () => {
  it("should return path without query when no params", () => {
    expect(buildUrl("/api/employees")).toBe("/api/employees");
    expect(buildUrl("/api/employees", {})).toBe("/api/employees");
  });

  it("should append query params", () => {
    const result = buildUrl("/api/employees", { search: "john", page: 1 });
    expect(result).toBe("/api/employees?search=john&page=1");
  });

  it("should skip null and undefined values", () => {
    const result = buildUrl("/api/data", { a: "yes", b: null, c: undefined });
    expect(result).toBe("/api/data?a=yes");
  });

  it("should skip empty string values", () => {
    const result = buildUrl("/api/data", { name: "", age: 25 });
    expect(result).toBe("/api/data?age=25");
  });

  it("should handle all falsy params gracefully", () => {
    const result = buildUrl("/api/data", { a: "", b: null, c: undefined });
    expect(result).toBe("/api/data");
  });

  it("should handle zero as a valid value", () => {
    const result = buildUrl("/api/data", { page: 0 });
    expect(result).toBe("/api/data?page=0");
  });
});
