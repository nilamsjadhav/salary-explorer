const request = require("supertest");
const { getDb, closeDb } = require("./db");
const { seed } = require("./seed");
const employees = require("./data/fifty_employees.json");

const totalEmployees = employees.length;

process.env.DB_PATH = ":memory:";

const app = require("./app");

beforeAll(() => {
  getDb();
  seed();
});

afterAll(() => {
  closeDb();
});

describe("app.js", () => {
  it("should have CORS enabled", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });

  it("should mount GET /api/employees route", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("totalRecords", totalEmployees);
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.statusCode).toBe(404);
  });

  it("should return JSON content type for employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
