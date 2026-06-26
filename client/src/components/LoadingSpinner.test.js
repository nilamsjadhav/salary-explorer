import { render, screen } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render a circular progress indicator", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
