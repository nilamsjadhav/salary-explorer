import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ReportsSection from "./ReportsSection";
import employeeService from "../middleware/employeeService";

jest.mock("../middleware/employeeService");

const mockReports = {
  top5HighestPaidEmployees: [
    { employeeId: "E1", name: "Alice", department: "Engineering", country: "India", salary: 200000, currency: "INR" },
    { employeeId: "E2", name: "Bob", department: "Finance", country: "India", salary: 180000, currency: "INR" },
  ],
  averageSalaryByDepartment: [
    { department: "Engineering", averageSalary: 150000, currency: "INR" },
    { department: "Finance", averageSalary: 120000, currency: "INR" },
  ],
  payrollByDepartment: [
    { department: "Engineering", totalPayroll: 600000, employeeCount: 4, currency: "INR" },
    { department: "Finance", totalPayroll: 360000, employeeCount: 3, currency: "INR" },
  ],
};

describe("ReportsSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    employeeService.getReports.mockResolvedValue(mockReports);
  });

  it("should render loading state initially", () => {
    employeeService.getReports.mockReturnValue(new Promise(() => {}));
    render(<ReportsSection />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render all three report tables", async () => {
    render(<ReportsSection />);

    await waitFor(() => {
      expect(screen.getByText("Top 5 Highest Paid Employees")).toBeInTheDocument();
    });

    expect(screen.getByText("Average Salary by Department")).toBeInTheDocument();
    expect(screen.getByText("Payroll by Department")).toBeInTheDocument();
  });

  it("should display top 5 employee data", async () => {
    render(<ReportsSection />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("should display average salary by department", async () => {
    render(<ReportsSection />);

    await waitFor(() => {
      expect(screen.getByText("150,000")).toBeInTheDocument();
    });
  });

  it("should display payroll data", async () => {
    render(<ReportsSection />);

    await waitFor(() => {
      expect(screen.getByText("600,000")).toBeInTheDocument();
    });
  });

  it("should render country filter and call API on change", async () => {
    render(<ReportsSection />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    expect(employeeService.getReports).toHaveBeenCalledWith({});

    const countrySelect = screen.getByLabelText("Country");
    fireEvent.mouseDown(countrySelect);

    const indiaOption = await screen.findByRole("option", { name: "India" });
    fireEvent.click(indiaOption);

    await waitFor(() => {
      expect(employeeService.getReports).toHaveBeenCalledWith({ country: "India" });
    });
  });

  it("should show error state on failure", async () => {
    employeeService.getReports.mockRejectedValue(new Error("Network error"));
    render(<ReportsSection />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load reports/)).toBeInTheDocument();
    });
  });

  it("should show no data message when arrays are empty", async () => {
    employeeService.getReports.mockResolvedValue({
      top5HighestPaidEmployees: [],
      averageSalaryByDepartment: [],
      payrollByDepartment: [],
    });

    render(<ReportsSection />);

    await waitFor(() => {
      const noCells = screen.getAllByText("No data available");
      expect(noCells.length).toBe(3);
    });
  });
});
