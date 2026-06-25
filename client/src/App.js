import TabLayout from './components/TabLayout';
import { AppBar, Toolbar, Typography } from '@mui/material';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Salary Explorer</Typography>
        </Toolbar>
      </AppBar>
      <TabLayout />
    </div>
  );
}

export default App;
