import { Box, Typography, Divider, Stack, Paper } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchBar from "./SearchBar";
import DateRangeFilter from "./DateRangeFilter";
import SalaryFilter from "./SalaryFilter";

const FilterPanel = ({
  searchTerm,
  fromDate,
  toDate,
  currency,
  minSalary,
  maxSalary,
  onSearchChange,
  onFromDateChange,
  onToDateChange,
  onCurrencyChange,
  onMinSalaryChange,
  onMaxSalaryChange,
}) => (
  <Paper
    elevation={1}
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
      <FilterListIcon fontSize="small" color="primary" />
      <Typography variant="subtitle2" color="primary" fontWeight={600}>
        Search & Filters
      </Typography>
    </Stack>
    <SearchBar value={searchTerm} onChange={onSearchChange} />
    <Divider sx={{ my: 1.5 }} />
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
      <DateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
      />
      <Divider orientation="vertical" flexItem />
      <SalaryFilter
        currency={currency}
        minSalary={minSalary}
        maxSalary={maxSalary}
        onCurrencyChange={onCurrencyChange}
        onMinSalaryChange={onMinSalaryChange}
        onMaxSalaryChange={onMaxSalaryChange}
      />
    </Box>
  </Paper>
);

export default FilterPanel;
