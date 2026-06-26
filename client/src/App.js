import TabLayout from './components/TabLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { AppBar, Toolbar, Typography } from '@mui/material';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Salary Explorer</Typography>
        </Toolbar>
      </AppBar>
      <ErrorBoundary>
        <TabLayout />
      </ErrorBoundary>
    </div>
  );
}

export default App;
