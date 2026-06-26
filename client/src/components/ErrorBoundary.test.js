import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const BrokenComponent = () => {
  throw new Error("Test crash");
};

const WorkingComponent = () => <div>All good</div>;

describe("ErrorBoundary", () => {
  // Suppress React error boundary console errors during tests
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should render children when no error", () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("should render error UI when child crashes", () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test crash")).toBeInTheDocument();
  });

  it("should render Try Again button", () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("should reset error state when Try Again is clicked", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Rerender with a working component before clicking reset
    rerender(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(screen.getByText("All good")).toBeInTheDocument();
  });
});
