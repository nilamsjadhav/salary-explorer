import employeeService from "./employeeService";
import api from "./api";

jest.mock("./api");

describe("employeeService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call api.get with /api/employees when no params", async () => {
      const mockData = { data: [{ employeeId: "EMP001" }], totalRecords: 1 };
      api.get.mockResolvedValue(mockData);

      const result = await employeeService.getAll();

      expect(api.get).toHaveBeenCalledWith("/api/employees");
      expect(result).toEqual(mockData);
    });

    it("should build query string from params", async () => {
      api.get.mockResolvedValue({ data: [], totalRecords: 0 });

      await employeeService.getAll({ search: "John", department: "Engineering" });

      expect(api.get).toHaveBeenCalledWith(
        "/api/employees?search=John&department=Engineering"
      );
    });

    it("should include date params in query string", async () => {
      api.get.mockResolvedValue({ data: [], totalRecords: 0 });

      await employeeService.getAll({ fromDate: "2021-01-01", toDate: "2022-12-31" });

      expect(api.get).toHaveBeenCalledWith(
        "/api/employees?fromDate=2021-01-01&toDate=2022-12-31"
      );
    });

    it("should include salary range params", async () => {
      api.get.mockResolvedValue({ data: [], totalRecords: 0 });

      await employeeService.getAll({ minSalary: "50000", maxSalary: "100000" });

      expect(api.get).toHaveBeenCalledWith(
        "/api/employees?minSalary=50000&maxSalary=100000"
      );
    });

    it("should skip falsy params", async () => {
      api.get.mockResolvedValue({ data: [], totalRecords: 0 });

      await employeeService.getAll({ search: "", fromDate: "", department: "HR" });

      expect(api.get).toHaveBeenCalledWith("/api/employees?department=HR");
    });

    it("should propagate errors from api.get", async () => {
      api.get.mockRejectedValue(new Error("Network error"));

      await expect(employeeService.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("getDashboard", () => {
    it("should call api.get with /api/dashboard when no params", async () => {
      const mockStats = { averageSalary: 100000 };
      api.get.mockResolvedValue(mockStats);

      const result = await employeeService.getDashboard();

      expect(api.get).toHaveBeenCalledWith("/api/dashboard");
      expect(result).toEqual(mockStats);
    });

    it("should pass currency param in query string", async () => {
      api.get.mockResolvedValue({});

      await employeeService.getDashboard({ currency: "USD" });

      expect(api.get).toHaveBeenCalledWith("/api/dashboard?currency=USD");
    });
  });

  describe("getDepartments", () => {
    it("should call api.get with /api/dashboard/departments", async () => {
      const mockData = [{ department: "Engineering", count: 4 }];
      api.get.mockResolvedValue(mockData);

      const result = await employeeService.getDepartments();

      expect(api.get).toHaveBeenCalledWith("/api/dashboard/departments");
      expect(result).toEqual(mockData);
    });
  });
});
