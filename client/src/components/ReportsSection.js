import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import employeeService from "../services/employeeService";
import useApiData from "../hooks/useApiData";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";
import ReportTable from "./ReportTable";
import { COUNTRIES } from "../constants/countries";

const TOP5_COLUMNS = [
  { key: "rank", label: "#", render: (_, i) => i + 1 },
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "country", label: "Country" },
  { key: "salary", label: "Salary", align: "right", render: (row) => Number(row.salary).toLocaleString() },
  { key: "currency", label: "Currency" },
];

const AVG_SALARY_COLUMNS = [
  { key: "department", label: "Department" },
  { key: "averageSalary", label: "Avg Salary", align: "right", render: (row) => Number(row.averageSalary).toLocaleString() },
  { key: "currency", label: "Currency" },
];

const PAYROLL_COLUMNS = [
  { key: "department", label: "Department" },
  { key: "totalPayroll", label: "Total Payroll", align: "right", render: (row) => Number(row.totalPayroll).toLocaleString() },
  { key: "employeeCount", label: "Employees", align: "right" },
  { key: "currency", label: "Currency" },
];

const ReportsSection = () => {
  const [country, setCountry] = useState("All");
  const { data: reports, loading, error } = useApiData(
    () => employeeService.getReports(country !== "All" ? { country } : {}),
    [country]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={`Failed to load reports: ${error}`} />;
  }

  const { top5HighestPaidEmployees = [], averageSalaryByDepartment = [], payrollByDepartment = [] } = reports || {};

  return (
    <Box>
      <Box sx={{ mb: 1.5 }}>
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

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ReportTable title="Top 5 Highest Paid Employees" columns={TOP5_COLUMNS} rows={top5HighestPaidEmployees} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReportTable title="Average Salary by Department" columns={AVG_SALARY_COLUMNS} rows={averageSalaryByDepartment} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReportTable title="Payroll by Department" columns={PAYROLL_COLUMNS} rows={payrollByDepartment} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsSection;
