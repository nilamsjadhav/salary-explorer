import api, { ApiError } from "./api";

const mockHeaders = {
  get: (key) => (key === "content-type" ? "application/json" : null),
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("api middleware", () => {
  describe("GET requests", () => {
    it("should call fetch with correct URL and method", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: () => Promise.resolve([]),
      });

      await api.get("/api/employees");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/employees",
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should return parsed JSON on success", async () => {
      const mockData = [{ employeeId: "EMP001", name: "John" }];
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: () => Promise.resolve(mockData),
      });

      const result = await api.get("/api/employees");
      expect(result).toEqual(mockData);
    });

    it("should NOT include Content-Type header for GET requests", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: () => Promise.resolve({}),
      });

      await api.get("/api/test");

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers["Content-Type"]).toBeUndefined();
    });

    it("should return null for 204 No Content", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 204,
        headers: { get: () => null },
      });

      const result = await api.get("/api/employees");
      expect(result).toBeNull();
    });

    it("should return null when content-type is not JSON", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => "text/plain" },
      });

      const result = await api.get("/api/health");
      expect(result).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should throw ApiError with status and body on non-ok response", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: () => Promise.resolve("Resource not found"),
      });

      try {
        await api.get("/api/unknown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(404);
        expect(error.endpoint).toBe("/api/unknown");
        expect(error.message).toBe("API error 404: Resource not found");
      }
    });

    it("should throw ApiError with statusText when body is empty", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: () => Promise.resolve(""),
      });

      await expect(api.get("/api/fail")).rejects.toThrow(
        "API error 500: Internal Server Error"
      );
    });

    it("should handle text() rejection gracefully", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
        text: () => Promise.reject(new Error("parse error")),
      });

      await expect(api.get("/api/fail")).rejects.toThrow(
        "API error 502: Bad Gateway"
      );
    });
  });
});
