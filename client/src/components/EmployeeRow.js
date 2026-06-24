import { TableRow, TableCell, Chip } from "@mui/material";
import { departmentColors } from "../constants/departmentColors";
import { formatSalary, formatDate } from "../utils/formatters";

const EmployeeRow = ({ employee }) => {
  const { employeeId, name, department, designation, location, country, joiningDate, salary, currency } = employee;

  return (
    <TableRow hover>
      <TableCell>{employeeId}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        <Chip
          label={department}
          color={departmentColors[department] || "default"}
          size="small"
        />
      </TableCell>
      <TableCell>{designation}</TableCell>
      <TableCell>{location}</TableCell>
      <TableCell>{country}</TableCell>
      <TableCell>{formatDate(joiningDate)}</TableCell>
      <TableCell align="right">{formatSalary(salary, currency)}</TableCell>
    </TableRow>
  );
};

export default EmployeeRow;
