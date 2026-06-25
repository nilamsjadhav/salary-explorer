import { render, screen, waitFor } from "@testing-library/react";
import SalaryDistributionChart from "./SalaryDistributionChart";
import employeeService from "../middleware/employeeService";

jest.mock("../middleware/employeeService");

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockData = [
  { salaryRange: "0-10 LPA", employeeCount: 1 },
  { salaryRange: "10-20 LPA", employeeCount: 2 },
  { salaryRange: "20-30 LPA", employeeCount: 1 },
  { salaryRange: "30+ LPA", employeeCount: 0 },
];

describe("SalaryDistributionChart", () => {
  it("renders loading state initially", () => {
    employeeService.getSalaryDistribution.mockReturnValue(new Promise(() => {}));
    render(<SalaryDistributionChart />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders chart with title and currency selector after data loads", async () => {
    employeeService.getSalaryDistribution.mockResolvedValue(mockData);
    render(<SalaryDistributionChart />);
    await waitFor(() => {
      expect(screen.getByText("Salary Distribution")).toBeInTheDocument();
      expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    });
  });

  it("fetches data with default currency INR", async () => {
    employeeService.getSalaryDistribution.mockResolvedValue(mockData);
    render(<SalaryDistributionChart />);
    await waitFor(() => {
      expect(employeeService.getSalaryDistribution).toHaveBeenCalledWith({ currency: "INR" });
    });
  });

  it("renders error state on failure", async () => {
    employeeService.getSalaryDistribution.mockRejectedValue(new Error("Network error"));
    render(<SalaryDistributionChart />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load salary data/)).toBeInTheDocument();
    });
  });
});
