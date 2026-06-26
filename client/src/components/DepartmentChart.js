import { useEffect, useState } from "react";
import { Box, CircularProgress, Alert, Paper, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import employeeService from "../middleware/employeeService";

const COLORS = ["#1976d2", "#388e3c", "#f57c00", "#d32f2f", "#7b1fa2", "#0097a7", "#c2185b", "#512da8", "#00695c", "#ef6c00", "#283593", "#4e342e", "#546e7a"];

const DepartmentChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    employeeService
      .getDepartments()
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load department data: {error}</Alert>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Employees by Department
      </Typography>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="department" width={90} />
          <Tooltip formatter={(value) => [`${value} employees`]} />
          <Bar dataKey="count" name="Employees" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DepartmentChart;
