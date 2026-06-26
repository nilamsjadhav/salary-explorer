import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../../src/components/Dashboard";
import employeeService from "../../src/services/employeeService";

jest.mock("../../src/services/employeeService");

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockStats = {
  averageSalary: 2112833.33,
  highestSalary: 9500000,
  lowestSalary: 72000,
  totalPayroll: 25354000,
};

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    employeeService.getDepartments.mockResolvedValue([]);
    employeeService.getSalaryDistribution.mockResolvedValue([]);
    employeeService.getGenderDistribution.mockResolvedValue([]);
    employeeService.getReports.mockResolvedValue({
      top5HighestPaidEmployees: [],
      averageSalaryByDepartment: [],
      payrollByDepartment: [],
    });
  });

  it("should show loading spinner initially", () => {
    employeeService.getDashboard.mockReturnValue(new Promise(() => {}));
    employeeService.getDepartments.mockReturnValue(new Promise(() => {}));
    employeeService.getSalaryDistribution.mockReturnValue(new Promise(() => {}));
    employeeService.getGenderDistribution.mockReturnValue(new Promise(() => {}));
    employeeService.getReports.mockReturnValue(new Promise(() => {}));
    render(<Dashboard />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should display all stat cards after loading", async () => {
    employeeService.getDashboard.mockResolvedValue(mockStats);
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Average Salary/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Highest Salary/)).toBeInTheDocument();
    expect(screen.getByText(/Lowest Salary/)).toBeInTheDocument();
    expect(screen.getAllByText(/Total Payroll/).length).toBeGreaterThanOrEqual(1);
  });

  it("should show currency selector with INR as default", async () => {
    employeeService.getDashboard.mockResolvedValue(mockStats);
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getAllByLabelText("Currency").length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByText("INR (₹)").length).toBeGreaterThanOrEqual(1);
  });

  it("should fetch dashboard with default currency INR", async () => {
    employeeService.getDashboard.mockResolvedValue(mockStats);
    render(<Dashboard />);

    await waitFor(() => {
      expect(employeeService.getDashboard).toHaveBeenCalledWith({ currency: "INR" });
    });
  });

  it("should show error message on failure", async () => {
    employeeService.getDashboard.mockRejectedValue(new Error("Network error"));
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load dashboard: Network error")).toBeInTheDocument();
    });
  });

  it("should not show loading after data loads", async () => {
    employeeService.getDashboard.mockResolvedValue(mockStats);
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("should show Reports & Analytics heading", async () => {
    employeeService.getDashboard.mockResolvedValue(mockStats);
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Reports & Analytics")).toBeInTheDocument();
    });
  });
});
