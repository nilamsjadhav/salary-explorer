import { useEffect, useState, useCallback } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Grid, TextField, MenuItem } from "@mui/material";
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        KPI Cards
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Currency"
          size="small"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{ width: 180 }}
        >
          {CURRENCIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {STAT_CARDS.map(({ key, label, color }) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card sx={{ borderTop: `4px solid ${color}` }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold", color }}>
                  {formatSalary(stats[key], currency)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        Charts
      </Typography>

      <Grid container spacing={3}>
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

      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        Reports &amp; Analytics
      </Typography>

      <ReportsSection />
    </Box>
  );
};

export default Dashboard;
