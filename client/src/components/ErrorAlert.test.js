import { render, screen } from "@testing-library/react";
import ErrorAlert from "./ErrorAlert";

describe("ErrorAlert", () => {
  it("should render the error message", () => {
    render(<ErrorAlert message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should render with error severity", () => {
    render(<ErrorAlert message="Fail" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
