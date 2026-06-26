import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={6}>
          <Paper sx={{ p: 4, textAlign: "center", maxWidth: 500 }}>
            <ErrorOutlinedIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </Typography>
            <Button variant="contained" onClick={this.handleReset}>
              Try Again
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
