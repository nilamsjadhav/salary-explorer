import { render, screen } from "@testing-library/react";
import ReportTable from "../../src/components/ReportTable";

const columns = [
  { key: "name", label: "Name" },
  { key: "salary", label: "Salary", align: "right", render: (row) => `$${row.salary}` },
];

const rows = [
  { name: "Alice", salary: 1000 },
  { name: "Bob", salary: 2000 },
];

describe("ReportTable", () => {
  it("should render the title", () => {
    render(<ReportTable title="Test Report" columns={columns} rows={rows} />);
    expect(screen.getByText("Test Report")).toBeInTheDocument();
  });

  it("should render column headers", () => {
    render(<ReportTable title="Test Report" columns={columns} rows={rows} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
  });

  it("should render row data with custom render", () => {
    render(<ReportTable title="Test Report" columns={columns} rows={rows} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("$1000")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("$2000")).toBeInTheDocument();
  });

  it("should show empty message when no rows", () => {
    render(<ReportTable title="Empty" columns={columns} rows={[]} />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("should show custom empty message", () => {
    render(<ReportTable title="Empty" columns={columns} rows={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
