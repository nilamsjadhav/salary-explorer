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
} from "@mui/material";
import employeeService from "../middleware/employeeService";
import SearchBar from "./SearchBar";
import DateRangeFilter from "./DateRangeFilter";
import EmployeeRow from "./EmployeeRow";

const SEARCHABLE_FIELDS = ["employeeId", "name", "department", "designation", "location", "country"];

const headerCellSx = { color: "white", fontWeight: "bold" };

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    employeeService
      .getAll()
      .then((data) => setEmployees(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = SEARCHABLE_FIELDS.some((field) =>
      emp[field].toLowerCase().includes(term)
    );

    const matchesFromDate = !fromDate || emp.joiningDate >= fromDate;
    const matchesToDate = !toDate || emp.joiningDate <= toDate;

    return matchesSearch && matchesFromDate && matchesToDate;
  });

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

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <DateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={headerCellSx}>Employee ID</TableCell>
              <TableCell sx={headerCellSx}>Name</TableCell>
              <TableCell sx={headerCellSx}>Department</TableCell>
              <TableCell sx={headerCellSx}>Designation</TableCell>
              <TableCell sx={headerCellSx}>Location</TableCell>
              <TableCell sx={headerCellSx}>Country</TableCell>
              <TableCell sx={headerCellSx}>Joining Date</TableCell>
              <TableCell sx={headerCellSx} align="right">Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No employees found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((emp) => (
                <EmployeeRow key={emp.employeeId} employee={emp} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default EmployeeTable;