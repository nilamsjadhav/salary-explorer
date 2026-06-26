import { Paper, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import employeeService from "../services/employeeService";
import useApiData from "../hooks/useApiData";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";

const COLORS = ["#1976d2", "#388e3c", "#f57c00", "#d32f2f", "#7b1fa2", "#0097a7", "#c2185b", "#512da8", "#00695c", "#ef6c00", "#283593", "#4e342e", "#546e7a"];

const DepartmentChart = () => {
  const { data, loading, error } = useApiData(() => employeeService.getDepartments(), []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={`Failed to load department data: ${error}`} />;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }} gutterBottom>
        Employees by Department
      </Typography>
      <ResponsiveContainer width="100%" height={Math.max(200, (data || []).length * 28)}>
        <BarChart data={data || []} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="department" width={140} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(value) => [`${value} employees`]} />
          <Bar dataKey="count" name="Employees" radius={[0, 4, 4, 0]}>
            {(data || []).map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DepartmentChart;
