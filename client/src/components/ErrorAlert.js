import { Alert } from "@mui/material";

const ErrorAlert = ({ message }) => (
  <Alert severity="error" sx={{ m: 2 }}>
    {message}
  </Alert>
);

export default ErrorAlert;
