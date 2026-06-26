import { Box, CircularProgress, Alert, Paper, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import employeeService from "../middleware/employeeService";
import useApiData from "../hooks/useApiData";

const COLORS = ["#5c6bc0", "#66bb6a"];

const GenderChart = () => {
  const { data, loading, error } = useApiData(() => employeeService.getGenderDistribution(), []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load gender data: {error}</Alert>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Gender Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="gender"
            cx="50%"
            cy="50%"
            outerRadius="75%"
            label={({ gender, count }) => `${gender} (${count})`}
          >
            {(data || []).map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} employees`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default GenderChart;
