// Mock paths must match what server.js uses internally (relative to server.js)
jest.mock("../src/database/db", () => ({
  getDb: jest.fn(),
  closeDb: jest.fn(),
}));
jest.mock("../src/database/seed", () => ({
  seed: jest.fn(),
}));

describe("server.js", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it("should export an express app", () => {
    const app = require("../src/server");
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe("function");
  });

  it("should not start listening when required as module", () => {
    const { getDb } = require("../src/database/db");
    const { seed } = require("../src/database/seed");

    require("../src/server");

    // When required as a module (not run directly), getDb/seed should NOT be called
    expect(getDb).not.toHaveBeenCalled();
    expect(seed).not.toHaveBeenCalled();
  });

  it("should create app via createApp factory", () => {
    const app = require("../src/server");
    // createApp is called at module load, resulting in a valid express app
    expect(app).toBeDefined();
    expect(typeof app.get).toBe("function");
    expect(typeof app.use).toBe("function");
  });
});
