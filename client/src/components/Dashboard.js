import { useState } from "react";
import { Box, Typography, CircularProgress, Alert, Grid, TextField, MenuItem, Chip, Paper } from "@mui/material";
import employeeService from "../middleware/employeeService";
import useApiData from "../hooks/useApiData";
import { formatSalary } from "../utils/formatters";
import { CURRENCIES, STAT_CARDS } from "../constants/currencies";
import DepartmentChart from "./DepartmentChart";
import SalaryDistributionChart from "./SalaryDistributionChart";
import GenderChart from "./GenderChart";
import ReportsSection from "./ReportsSection";

const Dashboard = () => {
  const [currency, setCurrency] = useState("INR");
  const { data: stats, loading, error } = useApiData(
    () => employeeService.getDashboard({ currency }),
    [currency]
  );

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
      {/* KPI Section — wrapped in Paper to show association */}
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            KPI Cards
          </Typography>
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
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
        </Box>
      </Paper>

      {/* Charts Section */}
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          Charts
        </Typography>
        <Grid container spacing={2}>
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
      </Paper>

      {/* Reports & Analytics Section */}
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          Reports &amp; Analytics
        </Typography>
        <ReportsSection />
      </Paper>
    </Box>
  );
};

export default Dashboard;
