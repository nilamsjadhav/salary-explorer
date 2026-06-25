import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import employeeService from "../middleware/employeeService";

const COUNTRIES = [
  "All",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Japan",
  "Mexico",
  "Netherlands",
  "Singapore",
  "South Korea",
  "UAE",
  "UK",
  "USA",
];

const ReportsSection = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("All");

  const fetchReports = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = country !== "All" ? { country } : {};
    employeeService
      .getReports(params)
      .then((data) => setReports(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [country]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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
        Failed to load reports: {error}
      </Alert>
    );
  }

  const { top5HighestPaidEmployees = [], averageSalaryByDepartment = [], payrollByDepartment = [] } = reports || {};

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Country"
          size="small"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          sx={{ width: 200 }}
        >
          {COUNTRIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {/* Top 5 Highest Paid Employees */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Top 5 Highest Paid Employees
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">Salary</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {top5HighestPaidEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No data available</TableCell>
                  </TableRow>
                ) : (
                  top5HighestPaidEmployees.map((emp, i) => (
                    <TableRow key={emp.employeeId || i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.country}</TableCell>
                      <TableCell align="right">{Number(emp.salary).toLocaleString()}</TableCell>
                      <TableCell>{emp.currency}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Average Salary by Department */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Average Salary by Department
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">Avg Salary</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {averageSalaryByDepartment.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No data available</TableCell>
                  </TableRow>
                ) : (
                  averageSalaryByDepartment.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.department}</TableCell>
                      <TableCell align="right">{Number(row.averageSalary).toLocaleString()}</TableCell>
                      <TableCell>{row.currency}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Payroll by Department */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Payroll by Department
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">Total Payroll</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">Employees</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrollByDepartment.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No data available</TableCell>
                  </TableRow>
                ) : (
                  payrollByDepartment.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.department}</TableCell>
                      <TableCell align="right">{Number(row.totalPayroll).toLocaleString()}</TableCell>
                      <TableCell align="right">{row.employeeCount}</TableCell>
                      <TableCell>{row.currency}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsSection;
