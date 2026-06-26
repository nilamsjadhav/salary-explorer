import { render, screen } from "@testing-library/react";
import FilterPanel from "../../src/components/FilterPanel";

describe("FilterPanel", () => {
  const defaultProps = {
    searchTerm: "",
    fromDate: "",
    toDate: "",
    currency: "All",
    minSalary: "",
    maxSalary: "",
    onSearchChange: jest.fn(),
    onFromDateChange: jest.fn(),
    onToDateChange: jest.fn(),
    onCurrencyChange: jest.fn(),
    onMinSalaryChange: jest.fn(),
    onMaxSalaryChange: jest.fn(),
  };

  it("should render the filter panel heading", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText("Search & Filters")).toBeInTheDocument();
  });

  it("should render search bar", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
  });

  it("should render date range labels", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText("From Date")).toBeInTheDocument();
    expect(screen.getByText("To Date")).toBeInTheDocument();
  });

  it("should render currency selector", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
  });

  it("should render salary fields", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByLabelText("Min Salary")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Salary")).toBeInTheDocument();
  });
});
