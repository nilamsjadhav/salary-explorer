import { useEffect, useState, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import employeeService from "../middleware/employeeService";
import SearchBar from "./SearchBar";
import DateRangeFilter from "./DateRangeFilter";
import SalaryFilter from "./SalaryFilter";
import Pagination from "./Pagination";
import EmployeeRow from "./EmployeeRow";

const headerCellSx = { color: "white", fontWeight: "bold" };

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [currency, setCurrency] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const isInitialLoad = useRef(true);

  const fetchEmployees = useCallback(() => {
    if (isInitialLoad.current) {
      setLoading(true);
    }
    setError(null);

    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (currency && currency !== "All") params.currency = currency;
    if (minSalary) params.minSalary = minSalary;
    if (maxSalary) params.maxSalary = maxSalary;
    params.page = page;
    params.pageSize = pageSize;

    employeeService
      .getAll(params)
      .then((response) => {
        setEmployees(response?.data || []);
        setTotalRecords(response?.totalRecords || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        isInitialLoad.current = false;
      });
  }, [searchTerm, fromDate, toDate, currency, minSalary, maxSalary, page, pageSize]);

  useEffect(() => {
    if (isInitialLoad.current) {
      fetchEmployees();
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchEmployees();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchEmployees]);

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

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setPage(1);
    if (value === "All") {
      setMinSalary("");
      setMaxSalary("");
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleFromDateChange = (value) => {
    setFromDate(value);
    setPage(1);
  };

  const handleToDateChange = (value) => {
    setToDate(value);
    setPage(1);
  };

  const handleMinSalaryChange = (value) => {
    setMinSalary(value);
    setPage(1);
  };

  const handleMaxSalaryChange = (value) => {
    setMaxSalary(value);
    setPage(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <SearchBar value={searchTerm} onChange={handleSearchChange} />

      <DateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
      />

      <SalaryFilter
        currency={currency}
        minSalary={minSalary}
        maxSalary={maxSalary}
        onCurrencyChange={handleCurrencyChange}
        onMinSalaryChange={handleMinSalaryChange}
        onMaxSalaryChange={handleMaxSalaryChange}
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
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No employees found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <EmployeeRow key={emp.employeeId} employee={emp} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Box>
  );
}

export default EmployeeTable;