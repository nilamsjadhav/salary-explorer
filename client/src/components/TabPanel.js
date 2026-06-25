import { Box } from "@mui/material";

const TabPanel = ({ children, value, index }) => {
  if (value !== index) return null;

  return (
    <Box role="tabpanel" sx={{ p: 3 }}>
      {children}
    </Box>
  );
};

export default TabPanel;
