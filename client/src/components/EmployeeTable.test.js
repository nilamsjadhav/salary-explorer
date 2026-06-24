import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
    country: "India",
    currency: "INR",
    joiningDate: "2021-03-15",
    salary: 1800000,
  },
  {
    employeeId: "EMP002",
    name: "Sarah Johnson",
    department: "HR",
    designation: "HR Manager",
    location: "London",
    country: "UK",
    currency: "GBP",
    joiningDate: "2022-01-20",
    salary: 72000,
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
    expect(screen.getByText("Country")).toBeInTheDocument();
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

  it("should display formatted salary with correct currency", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("₹18,00,000")).toBeInTheDocument();
    });

    expect(screen.getByText("£72,000")).toBeInTheDocument();
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

  it("should render a search input", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });
  });

  it("should filter employees by name", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Sarah" } });

    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
  });

  it("should filter employees by department", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "HR" } });

    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
  });

  it("should filter employees by country", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "UK" } });

    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
  });

  it("should show no results message when search has no matches", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "xyz123" } });

    expect(screen.getByText(/No employees found/i)).toBeInTheDocument();
  });

  it("should be case-insensitive search", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "john" } });

    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("should filter employees by from date", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const fromInput = screen.getByLabelText("From Date");
    fireEvent.change(fromInput, { target: { value: "2022-01-01" } });

    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
  });

  it("should filter employees by to date", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const toInput = screen.getByLabelText("To Date");
    fireEvent.change(toInput, { target: { value: "2021-12-31" } });

    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.queryByText("Sarah Johnson")).not.toBeInTheDocument();
  });

  it("should filter employees by date range", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const fromInput = screen.getByLabelText("From Date");
    const toInput = screen.getByLabelText("To Date");
    fireEvent.change(fromInput, { target: { value: "2021-01-01" } });
    fireEvent.change(toInput, { target: { value: "2021-12-31" } });

    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.queryByText("Sarah Johnson")).not.toBeInTheDocument();
  });
});
