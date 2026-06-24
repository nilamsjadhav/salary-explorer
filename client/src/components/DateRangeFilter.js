import { Box, TextField } from "@mui/material";

const DateRangeFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label="From Date"
        type="date"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 200 }}
      />
      <TextField
        label="To Date"
        type="date"
        value={toDate}
        onChange={(e) => onToDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 200 }}
      />
    </Box>
  );
};

export default DateRangeFilter;
