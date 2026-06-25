import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import TabPanel from "./TabPanel";
import EmployeeTable from "./EmployeeTable";
import Dashboard from "./Dashboard";
import CompensationInsights from "./CompensationInsights";

const TAB_CONFIG = [
  { label: "Workforce Overview", Component: EmployeeTable },
  { label: "Dashboard", Component: Dashboard },
  { label: "Compensation Insights", Component: CompensationInsights },
];

const TabLayout = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
      >
        {TAB_CONFIG.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {TAB_CONFIG.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          <tab.Component />
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabLayout;
