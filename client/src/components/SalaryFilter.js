import { Box, TextField, MenuItem } from "@mui/material";

const CURRENCIES = ["All", "INR", "USD", "GBP", "EUR", "JPY", "AUD"];

const SalaryFilter = ({ currency, minSalary, maxSalary, onCurrencyChange, onMinSalaryChange, onMaxSalaryChange }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
      <TextField
        select
        label="Currency"
        size="small"
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        sx={{ width: 140 }}
      >
        {CURRENCIES.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Min Salary"
        type="number"
        size="small"
        value={minSalary}
        onChange={(e) => onMinSalaryChange(e.target.value)}
        sx={{ width: 180 }}
        disabled={currency === "All"}
      />
      <TextField
        label="Max Salary"
        type="number"
        size="small"
        value={maxSalary}
        onChange={(e) => onMaxSalaryChange(e.target.value)}
        sx={{ width: 180 }}
        disabled={currency === "All"}
      />
    </Box>
  );
};

export default SalaryFilter;
