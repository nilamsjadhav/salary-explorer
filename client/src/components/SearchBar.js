import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ value, onChange }) => {
  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder="Search by name, department, designation, location or country..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mb: 0 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
