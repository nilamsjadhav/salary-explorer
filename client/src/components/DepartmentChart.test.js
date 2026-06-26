import { render, screen, waitFor } from "@testing-library/react";
import DepartmentChart from "./DepartmentChart";
import employeeService from "../services/employeeService";

jest.mock("../services/employeeService");

// recharts uses ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockData = [
  { department: "Engineering", count: 4 },
  { department: "Product", count: 3 },
  { department: "Design", count: 2 },
];

describe("DepartmentChart", () => {
  it("renders loading state initially", () => {
    employeeService.getDepartments.mockReturnValue(new Promise(() => {}));
    render(<DepartmentChart />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders chart after data loads", async () => {
    employeeService.getDepartments.mockResolvedValue(mockData);
    render(<DepartmentChart />);
    await waitFor(() => {
      expect(screen.getByText("Employees by Department")).toBeInTheDocument();
    });
  });

  it("renders error state on failure", async () => {
    employeeService.getDepartments.mockRejectedValue(new Error("Network error"));
    render(<DepartmentChart />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load department data/)).toBeInTheDocument();
    });
  });
});
