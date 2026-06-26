import { render, screen, waitFor } from "@testing-library/react";
import GenderChart from "../../src/components/GenderChart";
import employeeService from "../../src/services/employeeService";

jest.mock("../../src/services/employeeService");

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockData = [
  { gender: "male", count: 512 },
  { gender: "female", count: 488 },
];

describe("GenderChart", () => {
  it("renders loading state initially", () => {
    employeeService.getGenderDistribution.mockReturnValue(new Promise(() => {}));
    render(<GenderChart />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders chart after data loads", async () => {
    employeeService.getGenderDistribution.mockResolvedValue(mockData);
    render(<GenderChart />);
    await waitFor(() => {
      expect(screen.getByText("Gender Distribution")).toBeInTheDocument();
    });
  });

  it("renders error state on failure", async () => {
    employeeService.getGenderDistribution.mockRejectedValue(new Error("Network error"));
    render(<GenderChart />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load gender data/)).toBeInTheDocument();
    });
  });
});
