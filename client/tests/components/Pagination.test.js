import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../../src/components/Pagination";

describe("Pagination", () => {
  const defaultProps = {
    page: 1,
    pageSize: 10,
    totalRecords: 50,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display total record count", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/1–10 of 50/)).toBeInTheDocument();
  });

  it("should call onPageChange when next page is clicked", () => {
    render(<Pagination {...defaultProps} />);
    const nextButton = screen.getByLabelText("Go to next page");
    fireEvent.click(nextButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it("should disable previous button on first page", () => {
    render(<Pagination {...defaultProps} />);
    const prevButton = screen.getByLabelText("Go to previous page");
    expect(prevButton).toBeDisabled();
  });

  it("should call onPageChange when previous page is clicked", () => {
    render(<Pagination {...defaultProps} page={3} />);
    const prevButton = screen.getByLabelText("Go to previous page");
    fireEvent.click(prevButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageSizeChange and reset to page 1 when rows per page changes", () => {
    render(<Pagination {...defaultProps} />);
    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);
    const option = screen.getByRole("option", { name: "20" });
    fireEvent.click(option);
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(20);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it("should show correct range for page 2", () => {
    render(<Pagination {...defaultProps} page={2} />);
    expect(screen.getByText(/11–20 of 50/)).toBeInTheDocument();
  });
});
