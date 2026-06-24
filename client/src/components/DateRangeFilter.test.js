import { render, screen, fireEvent } from "@testing-library/react";
import DateRangeFilter from "./DateRangeFilter";

describe("DateRangeFilter", () => {
  const defaultProps = {
    fromDate: "",
    toDate: "",
    onFromDateChange: jest.fn(),
    onToDateChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render From Date and To Date inputs", () => {
    render(<DateRangeFilter {...defaultProps} />);
    expect(screen.getByLabelText("From Date")).toBeInTheDocument();
    expect(screen.getByLabelText("To Date")).toBeInTheDocument();
  });

  it("should display provided from date value", () => {
    render(<DateRangeFilter {...defaultProps} fromDate="2021-01-01" />);
    expect(screen.getByDisplayValue("2021-01-01")).toBeInTheDocument();
  });

  it("should display provided to date value", () => {
    render(<DateRangeFilter {...defaultProps} toDate="2023-12-31" />);
    expect(screen.getByDisplayValue("2023-12-31")).toBeInTheDocument();
  });

  it("should call onFromDateChange when from date changes", () => {
    render(<DateRangeFilter {...defaultProps} />);
    const fromInput = screen.getByLabelText("From Date");
    fireEvent.change(fromInput, { target: { value: "2022-06-01" } });

    expect(defaultProps.onFromDateChange).toHaveBeenCalledWith("2022-06-01");
  });

  it("should call onToDateChange when to date changes", () => {
    render(<DateRangeFilter {...defaultProps} />);
    const toInput = screen.getByLabelText("To Date");
    fireEvent.change(toInput, { target: { value: "2023-06-01" } });

    expect(defaultProps.onToDateChange).toHaveBeenCalledWith("2023-06-01");
  });
});
