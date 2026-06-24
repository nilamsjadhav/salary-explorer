import { render, screen, fireEvent } from "@testing-library/react";
import SalaryFilter from "./SalaryFilter";

describe("SalaryFilter", () => {
  const defaultProps = {
    currency: "All",
    minSalary: "",
    maxSalary: "",
    onCurrencyChange: jest.fn(),
    onMinSalaryChange: jest.fn(),
    onMaxSalaryChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render Currency, Min Salary and Max Salary inputs", () => {
    render(<SalaryFilter {...defaultProps} />);
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Min Salary")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Salary")).toBeInTheDocument();
  });

  it("should disable min/max inputs when currency is All", () => {
    render(<SalaryFilter {...defaultProps} />);
    expect(screen.getByLabelText("Min Salary")).toBeDisabled();
    expect(screen.getByLabelText("Max Salary")).toBeDisabled();
  });

  it("should enable min/max inputs when a currency is selected", () => {
    render(<SalaryFilter {...defaultProps} currency="USD" />);
    expect(screen.getByLabelText("Min Salary")).not.toBeDisabled();
    expect(screen.getByLabelText("Max Salary")).not.toBeDisabled();
  });

  it("should call onMinSalaryChange when min salary is entered", () => {
    render(<SalaryFilter {...defaultProps} currency="INR" />);
    fireEvent.change(screen.getByLabelText("Min Salary"), { target: { value: "50000" } });
    expect(defaultProps.onMinSalaryChange).toHaveBeenCalledWith("50000");
  });

  it("should call onMaxSalaryChange when max salary is entered", () => {
    render(<SalaryFilter {...defaultProps} currency="INR" />);
    fireEvent.change(screen.getByLabelText("Max Salary"), { target: { value: "100000" } });
    expect(defaultProps.onMaxSalaryChange).toHaveBeenCalledWith("100000");
  });

  it("should display current values", () => {
    render(<SalaryFilter {...defaultProps} currency="USD" minSalary="30000" maxSalary="90000" />);
    expect(screen.getByLabelText("Min Salary")).toHaveValue(30000);
    expect(screen.getByLabelText("Max Salary")).toHaveValue(90000);
  });
});
