const request = require("supertest");
const app = require("./server");
const employees = require("./data/employees.json");

describe("GET /api/employees", () => {
  it("should return 200 status code", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.statusCode).toBe(200);
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return all 10 employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.body).toHaveLength(10);
  });

  it("should return employees matching the JSON data file", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.body).toEqual(employees);
  });

  it("should return employees with correct structure", async () => {
    const res = await request(app).get("/api/employees");
    const employee = res.body[0];
    expect(employee).toHaveProperty("employeeId");
    expect(employee).toHaveProperty("name");
    expect(employee).toHaveProperty("department");
    expect(employee).toHaveProperty("designation");
    expect(employee).toHaveProperty("location");
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
