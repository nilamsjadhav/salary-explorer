import { Box, TextField, MenuItem } from "@mui/material";
import { CURRENCY_VALUES } from "../constants/currencies";

const SalaryFilter = ({ currency, minSalary, maxSalary, onCurrencyChange, onMinSalaryChange, onMaxSalaryChange }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <TextField
        select
        label="Currency"
        size="small"
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        sx={{ width: 140 }}
      >
        {CURRENCY_VALUES.map((c) => (
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
