const { errorHandler } = require("../../src/middleware/errorHandler");

describe("errorHandler", () => {
  let req, res, next, consoleSpy;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    consoleSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should return 500 status by default", () => {
    const err = new Error("Something broke");
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something broke" });
  });

  it("should use error's status code if provided", () => {
    const err = new Error("Not Found");
    err.status = 404;
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not Found" });
  });

  it("should default message to Internal Server Error", () => {
    const err = {};
    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should log the error stack", () => {
    const err = new Error("fail");
    errorHandler(err, req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith(err.stack);
  });

  it("should log error message when no stack available", () => {
    const err = { message: "no stack" };
    errorHandler(err, req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith("no stack");
  });
});
