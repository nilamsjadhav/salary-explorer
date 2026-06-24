import employeeService from "./employeeService";
import api from "./api";

jest.mock("./api");

describe("employeeService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call api.get with /api/employees", async () => {
      const mockData = [{ employeeId: "EMP001", name: "John" }];
      api.get.mockResolvedValue(mockData);

      const result = await employeeService.getAll();

      expect(api.get).toHaveBeenCalledWith("/api/employees");
      expect(result).toEqual(mockData);
    });

    it("should propagate errors from api.get", async () => {
      api.get.mockRejectedValue(new Error("Network error"));

      await expect(employeeService.getAll()).rejects.toThrow("Network error");
    });
  });
});
