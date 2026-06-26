const request = require("supertest");
const path = require("path");
const { getDb, closeDb } = require("../src/database/db");
const { seed } = require("../src/database/seed");
const { createApp } = require("../src/app");
const employees = require("../src/data/fifty_employees.json");

const totalEmployees = employees.length;
const defaultPageSize = 20;
const DATA_PATH = path.join(__dirname, "..", "src", "data", "fifty_employees.json");
const app = createApp();

beforeAll(() => {
  getDb(":memory:");
  seed(DATA_PATH);
});

afterAll(() => {
  closeDb();
});

describe("App Integration", () => {
  it("should have CORS enabled", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should serve catch-all for unknown routes (SPA)", async () => {
    const res = await request(app).get("/api/unknown");
    expect([200, 404]).toContain(res.statusCode);
  });
});

describe("GET /healthz", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/healthz");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("uptime");
    expect(typeof res.body.uptime).toBe("number");
  });
});

describe("GET /api/employees", () => {
  it("should return 200 status code", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.statusCode).toBe(200);
  });

  it("should return all employees in paginated results", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.body.data).toHaveLength(Math.min(totalEmployees, defaultPageSize));
    expect(res.body.totalRecords).toBe(totalEmployees);
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
});
