import { useEffect, useState, useCallback } from "react";
import { Box, CircularProgress, Alert, Paper, Typography, TextField, MenuItem } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import employeeService from "../middleware/employeeService";
import { CURRENCIES } from "../constants/currencies";

const COLORS = ["#1976d2", "#388e3c", "#f57c00", "#d32f2f"];

const SalaryDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("INR");

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    employeeService
      .getSalaryDistribution({ currency })
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

      {error && <Alert severity="error">Failed to load salary data: {error}</Alert>}

      {!loading && !error && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="salaryRange" />
            <YAxis allowDecimals={false} label={{ value: "Employees", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value) => [value, "Employees"]} />
            <Bar dataKey="employeeCount" name="Employees" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
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
