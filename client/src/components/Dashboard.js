import { Box, Typography, Paper } from "@mui/material";

const Dashboard = () => {
  return (
    <Box>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          KPIs, salary charts, and department breakdowns coming soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
