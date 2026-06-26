import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
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

const mockResponse = { data: mockEmployees, page: 1, pageSize: 20, totalRecords: 2, totalPages: 1 };

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
    employeeService.getAll.mockResolvedValue(mockResponse);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
  });

  it("should display the search bar after loading", async () => {
    employeeService.getAll.mockResolvedValue(mockResponse);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
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
    employeeService.getAll.mockResolvedValue(mockResponse);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("should call API with search param when searching", async () => {
    employeeService.getAll.mockResolvedValue(mockResponse);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    const filteredResponse = { data: [mockEmployees[1]], page: 1, pageSize: 20, totalRecords: 1, totalPages: 1 };
    employeeService.getAll.mockResolvedValue(filteredResponse);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Sarah" } });
    });

    await waitFor(() => {
      expect(employeeService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Sarah" })
      );
    });
  });

  it("should call API with date params when filtering by date", async () => {
    employeeService.getAll.mockResolvedValue(mockResponse);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    employeeService.getAll.mockResolvedValue(mockResponse);

    const fromLabel = screen.getByText("From Date");
    const fromInput = fromLabel.closest("div").querySelector("input");
    await act(async () => {
      fireEvent.change(fromInput, { target: { value: "2022-01-01" } });
    });

    await waitFor(() => {
      expect(employeeService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ fromDate: "2022-01-01" })
      );
    });
  });

  it("should show no results message when API returns empty", async () => {
    const emptyResponse = { data: [], page: 1, pageSize: 20, totalRecords: 0, totalPages: 0 };
    employeeService.getAll.mockResolvedValue(emptyResponse);
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText(/No employees found/i)).toBeInTheDocument();
    });
  });
});
