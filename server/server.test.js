const request = require("supertest");
const { getDb, closeDb } = require("./db");
const { seed } = require("./seed");

// Use in-memory DB for tests
process.env.DB_PATH = ":memory:";

const app = require("./app");

beforeAll(() => {
  getDb();
  seed();
});

afterAll(() => {
  closeDb();
});

describe("GET /api/employees", () => {
  it("should return 200 status code", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.statusCode).toBe(200);
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return all 12 employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.body.data).toHaveLength(12);
    expect(res.body.totalRecords).toBe(12);
  });

  it("should return employees with correct structure", async () => {
    const res = await request(app).get("/api/employees");
    const employee = res.body.data[0];
    expect(employee).toHaveProperty("employeeId");
    expect(employee).toHaveProperty("name");
    expect(employee).toHaveProperty("department");
    expect(employee).toHaveProperty("designation");
    expect(employee).toHaveProperty("location");
    expect(employee).toHaveProperty("country");
    expect(employee).toHaveProperty("currency");
    expect(employee).toHaveProperty("joiningDate");
    expect(employee).toHaveProperty("salary");
  });

  it("should include CORS headers", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });
});

describe("Unknown routes", () => {
  it("should return 404 for unknown endpoints", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.statusCode).toBe(404);
  });
});
