import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" mt={4}>
    <CircularProgress />
  </Box>
);

export default LoadingSpinner;
