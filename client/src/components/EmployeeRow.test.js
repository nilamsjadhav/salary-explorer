import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import EmployeeRow from "./EmployeeRow";

const mockEmployee = {
  employeeId: "EMP001",
  name: "John Smith",
  department: "Engineering",
  designation: "Senior Engineer",
  location: "Pune",
  country: "India",
  currency: "INR",
  joiningDate: "2021-03-15",
  salary: 1800000,
};

const renderRow = (employee = mockEmployee) => {
  return render(
    <Table>
      <TableBody>
        <EmployeeRow employee={employee} />
      </TableBody>
    </Table>
  );
};

describe("EmployeeRow", () => {
  it("should render employee ID", () => {
    renderRow();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
  });

  it("should render employee name", () => {
    renderRow();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("should render department as a chip", () => {
    renderRow();
    const chip = screen.getByText("Engineering").closest(".MuiChip-root");
    expect(chip).toBeInTheDocument();
  });

  it("should render designation", () => {
    renderRow();
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
  });

  it("should render location", () => {
    renderRow();
    expect(screen.getByText("Pune")).toBeInTheDocument();
  });

  it("should render country", () => {
    renderRow();
    expect(screen.getByText("India")).toBeInTheDocument();
  });

  it("should render formatted joining date", () => {
    renderRow();
    expect(screen.getByText("15 Mar 2021")).toBeInTheDocument();
  });

  it("should render formatted salary with correct currency", () => {
    renderRow();
    expect(screen.getByText("₹18,00,000")).toBeInTheDocument();
  });

  it("should render GBP salary correctly", () => {
    renderRow({
      ...mockEmployee,
      employeeId: "EMP002",
      currency: "GBP",
      salary: 72000,
    });
    expect(screen.getByText("£72,000")).toBeInTheDocument();
  });
});
