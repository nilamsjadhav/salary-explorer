import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TabLayout from "./TabLayout";
import employeeService from "../middleware/employeeService";

jest.mock("../middleware/employeeService");

const mockResponse = { data: [], page: 1, pageSize: 10, totalRecords: 0, totalPages: 0 };

describe("TabLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    employeeService.getAll.mockResolvedValue(mockResponse);
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
    expect(screen.getByText(/KPIs, salary charts/)).toBeInTheDocument();
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
