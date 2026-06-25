import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TabLayout from "./TabLayout";
import employeeService from "../middleware/employeeService";

jest.mock("../middleware/employeeService");

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockResponse = { data: [], page: 1, pageSize: 10, totalRecords: 0, totalPages: 0 };
const mockDashboard = { averageSalary: 100000, highestSalary: 200000, lowestSalary: 50000, totalPayroll: 500000 };

describe("TabLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    employeeService.getAll.mockResolvedValue(mockResponse);
    employeeService.getDashboard.mockResolvedValue(mockDashboard);
    employeeService.getDepartments.mockResolvedValue([]);
    employeeService.getSalaryDistribution.mockResolvedValue([]);
    employeeService.getGenderDistribution.mockResolvedValue([]);
    employeeService.getReports.mockResolvedValue({
      top5HighestPaidEmployees: [],
      averageSalaryByDepartment: [],
      payrollByDepartment: [],
    });
  });

  it("should render all three tabs", () => {
    render(<TabLayout />);
    expect(screen.getByText("Workforce Overview")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Compensation Insights")).toBeInTheDocument();
  });

  it("should show Workforce Overview tab by default", async () => {
    render(<TabLayout />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });
  });

  it("should switch to Dashboard tab on click", async () => {
    render(<TabLayout />);
    fireEvent.click(screen.getByText("Dashboard"));
    await waitFor(() => {
      expect(screen.getByText("Average Salary")).toBeInTheDocument();
    });
  });

  it("should switch to Compensation Insights tab on click", () => {
    render(<TabLayout />);
    fireEvent.click(screen.getByText("Compensation Insights"));
    expect(screen.getByText(/Salary comparisons/)).toBeInTheDocument();
  });

  it("should hide other tab content when switching", async () => {
    render(<TabLayout />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Dashboard"));
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
  });
});
