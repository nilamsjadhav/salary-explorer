import { useState } from "react";
import { Box, CircularProgress, Paper, Typography, TextField, MenuItem } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import employeeService from "../services/employeeService";
import useApiData from "../hooks/useApiData";
import ErrorAlert from "./ErrorAlert";
import { CURRENCIES } from "../constants/currencies";

const COLORS = ["#1976d2", "#388e3c", "#f57c00", "#d32f2f"];

const SalaryDistributionChart = () => {
  const [currency, setCurrency] = useState("INR");
  const { data, loading, error } = useApiData(
    () => employeeService.getSalaryDistribution({ currency }),
    [currency]
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h6">Salary Distribution</Typography>
        <TextField
          select
          label="Currency"
          size="small"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{ width: 150 }}
        >
          {CURRENCIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {error && <ErrorAlert message={`Failed to load salary data: ${error}`} />}

      {!loading && !error && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data || []} margin={{ top: 5, right: 15, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="salaryRange" angle={-25} textAnchor="end" tick={{ fontSize: 12 }} interval={0} />
            <YAxis allowDecimals={false} label={{ value: "Employees", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value) => [value, "Employees"]} />
            <Bar dataKey="employeeCount" name="Employees" radius={[4, 4, 0, 0]}>
              {(data || []).map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default SalaryDistributionChart;
