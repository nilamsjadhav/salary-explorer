import { useEffect, useState, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import employeeService from "../middleware/employeeService";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";
import FilterPanel from "./FilterPanel";
import Pagination from "./Pagination";
import EmployeeRow from "./EmployeeRow";
import useEmployeeFilters from "../hooks/useEmployeeFilters";

const headerCellSx = { color: "white", fontWeight: "bold" };

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const isInitialLoad = useRef(true);

  const filters = useEmployeeFilters();
  const {
    searchTerm, fromDate, toDate, currency, minSalary, maxSalary,
    page, pageSize, setPage, setPageSize,
  } = filters;

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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={`Failed to load employees: ${error}`} />;
  }

  return (
    <Box sx={{ p: 2, pt: 1 }}>
      <FilterPanel
        searchTerm={searchTerm}
        fromDate={fromDate}
        toDate={toDate}
        currency={currency}
        minSalary={minSalary}
        maxSalary={maxSalary}
        onSearchChange={filters.handleSearchChange}
        onFromDateChange={filters.handleFromDateChange}
        onToDateChange={filters.handleToDateChange}
        onCurrencyChange={filters.handleCurrencyChange}
        onMinSalaryChange={filters.handleMinSalaryChange}
        onMaxSalaryChange={filters.handleMaxSalaryChange}
      />

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ "& .MuiTableCell-root": { py: 1.5, px: 2.5 } }}>
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