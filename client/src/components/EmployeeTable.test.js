import { render, screen, waitFor } from "@testing-library/react";
import EmployeeTable from "./EmployeeTable";
import employeeService from "../middleware/employeeService";

jest.mock("../middleware/employeeService");

const mockEmployees = [
  {
    employeeId: "EMP001",
    name: "John Smith",
    department: "Engineering",
    designation: "Senior Engineer",
    location: "Pune",
    joiningDate: "2021-03-15",
    salary: 1800000,
  },
  {
    employeeId: "EMP002",
    name: "Sarah Johnson",
    department: "HR",
    designation: "HR Manager",
    location: "Mumbai",
    joiningDate: "2022-01-20",
    salary: 1200000,
  },
];

describe("EmployeeTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading spinner initially", () => {
    employeeService.getAll.mockReturnValue(new Promise(() => {}));
    render(<EmployeeTable />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should display employee data in a table after loading", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("EMP002")).toBeInTheDocument();
  });

  it("should display the Employee Directory heading", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("Employee Directory")).toBeInTheDocument();
    });
  });

  it("should render all table column headers", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("Employee ID")).toBeInTheDocument();
    });

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Designation")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Joining Date")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
  });

  it("should display department as a chip", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
    });

    const chip = screen.getByText("Engineering").closest(".MuiChip-root");
    expect(chip).toBeInTheDocument();
  });

  it("should display formatted salary", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("₹18,00,000")).toBeInTheDocument();
    });
  });

  it("should display formatted date", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("15 Mar 2021")).toBeInTheDocument();
    });
  });

  it("should show error message when API call fails", async () => {
    employeeService.getAll.mockRejectedValue(new Error("Network error"));
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load employees: Network error")
      ).toBeInTheDocument();
    });
  });

  it("should not show loading spinner after data loads", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("should render correct number of data rows", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });
});
