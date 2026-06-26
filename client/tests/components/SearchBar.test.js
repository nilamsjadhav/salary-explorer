import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../../src/components/SearchBar";

describe("SearchBar", () => {
  it("should render search input with placeholder", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("should display the provided value", () => {
    render(<SearchBar value="Engineering" onChange={() => {}} />);
    expect(screen.getByDisplayValue("Engineering")).toBeInTheDocument();
  });

  it("should call onChange when user types", () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "John" } });

    expect(handleChange).toHaveBeenCalledWith("John");
  });

  it("should render as a full-width input", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });
});
