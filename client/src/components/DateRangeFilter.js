import { Box, TextField, Typography } from "@mui/material";

const DateRangeFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
          From Date
        </Typography>
        <TextField
          type="date"
          size="small"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          inputProps={{ "aria-label": "From Date" }}
          sx={{ width: 170 }}
        />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
          To Date
        </Typography>
        <TextField
          type="date"
          size="small"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          inputProps={{ "aria-label": "To Date" }}
          sx={{ width: 170 }}
        />
      </Box>
    </Box>
  );
};

export default DateRangeFilter;
