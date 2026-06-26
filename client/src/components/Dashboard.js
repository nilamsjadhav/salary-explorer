import { useEffect, useState, useCallback } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Grid, TextField, MenuItem, Chip, Stack } from "@mui/material";
import employeeService from "../middleware/employeeService";
import { formatSalary } from "../utils/formatters";
import { CURRENCIES, STAT_CARDS } from "../constants/currencies";
import DepartmentChart from "./DepartmentChart";
import SalaryDistributionChart from "./SalaryDistributionChart";
import GenderChart from "./GenderChart";
import ReportsSection from "./ReportsSection";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("INR");

  const fetchDashboard = useCallback(() => {
    setLoading(true);
    setError(null);

    employeeService
      .getDashboard({ currency })
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currency]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
        Failed to load dashboard: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* KPI Strip */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1, flexWrap: "wrap", gap: 1 }}>
          {STAT_CARDS.map(({ key, label, color }) => (
            <Chip
              key={key}
              label={`${label}: ${formatSalary(stats[key], currency)}`}
              sx={{
                backgroundColor: color,
                color: "white",
                fontWeight: "bold",
                fontSize: "0.85rem",
                height: 36,
                px: 1,
              }}
            />
          ))}
        </Stack>
        <TextField
          select
          label="Currency"
          size="small"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{ width: 150, flexShrink: 0 }}
        >
          {CURRENCIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Charts — side by side */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <DepartmentChart />
        </Grid>
        <Grid item xs={12} md={7}>
          <SalaryDistributionChart />
        </Grid>
        <Grid item xs={12} md={5}>
          <GenderChart />
        </Grid>
      </Grid>

      {/* Reports — collapsible accordion */}
      <ReportsSection />
    </Box>
  );
};

export default Dashboard;
