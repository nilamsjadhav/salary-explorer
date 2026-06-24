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

  it("should display employee data after loading", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
  });

  it("should display the Employee Directory heading", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("Employee Directory")).toBeInTheDocument();
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

  it("should filter employees by search term", async () => {
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

  it("should filter employees by date range", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const fromInput = screen.getByLabelText("From Date");
    const toInput = screen.getByLabelText("To Date");
    fireEvent.change(fromInput, { target: { value: "2022-01-01" } });
    fireEvent.change(toInput, { target: { value: "2023-01-01" } });

    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
  });

  it("should show no results message when no matches", async () => {
    employeeService.getAll.mockResolvedValue(mockEmployees);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "xyz123" } });

    expect(screen.getByText(/No employees found/i)).toBeInTheDocument();
  });
});
