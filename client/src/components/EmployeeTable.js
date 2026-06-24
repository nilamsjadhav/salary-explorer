import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from "@mui/material";
import employeeService from "../middleware/employeeService";
import { departmentColors } from "../constants/departmentColors";
import { formatSalary, formatDate } from "../utils/formatters";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    employeeService
      .getAll()
      .then((data) => setEmployees(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load employees: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Directory
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Employee ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Designation</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Joining Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.employeeId} hover>
                <TableCell>{emp.employeeId}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>
                  <Chip
                    label={emp.department}
                    color={departmentColors[emp.department] || "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{emp.designation}</TableCell>
                <TableCell>{emp.location}</TableCell>
                <TableCell>{formatDate(emp.joiningDate)}</TableCell>
                <TableCell align="right">{formatSalary(emp.salary)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default EmployeeTable;