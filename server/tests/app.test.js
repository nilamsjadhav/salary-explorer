const request = require("supertest");
const path = require("path");
const { getDb, closeDb } = require("../src/database/db");
const { seed } = require("../src/database/seed");
const { createApp } = require("../src/app");

const DATA_PATH = path.join(__dirname, "..", "src", "data", "fifty_employees.json");

let app;

beforeAll(() => {
  getDb(":memory:");
  seed(DATA_PATH);
  app = createApp();
});

afterAll(() => {
  closeDb();
});

describe("createApp", () => {
  it("should return an express app instance", () => {
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe("function");
  });

  it("should have CORS enabled", async () => {
    const res = await request(app).get("/healthz");
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });
});

describe("GET /healthz", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("should return uptime as a number", async () => {
    const res = await request(app).get("/healthz");
    expect(typeof res.body.uptime).toBe("number");
    expect(res.body.uptime).toBeGreaterThan(0);
  });
});

describe("Route mounting", () => {
  it("should mount /api/employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.status).toBe(200);
  });

  it("should mount /api/dashboard", async () => {
    const res = await request(app).get("/api/dashboard");
    expect(res.status).toBe(200);
  });

  it("should mount /api/dashboard/departments", async () => {
    const res = await request(app).get("/api/dashboard/departments");
    expect(res.status).toBe(200);
  });

  it("should mount /api/dashboard/salary-distribution", async () => {
    const res = await request(app).get("/api/dashboard/salary-distribution");
    expect(res.status).toBe(200);
  });

  it("should mount /api/dashboard/gender", async () => {
    const res = await request(app).get("/api/dashboard/gender");
    expect(res.status).toBe(200);
  });

  it("should mount /api/dashboard/reports", async () => {
    const res = await request(app).get("/api/dashboard/reports");
    expect(res.status).toBe(200);
  });

  it("should serve catch-all for unknown routes (SPA)", async () => {
    const res = await request(app).get("/api/unknown");
    // Catch-all serves index.html or returns 404 if build doesn't exist
    expect([200, 404]).toContain(res.status);
  });
});

describe("Error handler", () => {
  it("should handle errors with JSON response", async () => {
    const { errorHandler } = require("../src/middleware/errorHandler");
    // Create a minimal express app with just the error route
    const express = require("express");
    const errorApp = express();
    errorApp.get("/test-error", (req, res, next) => {
      next(new Error("test error"));
    });
    errorApp.use(errorHandler);

    const res = await request(errorApp).get("/test-error");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("test error");
  });
});
