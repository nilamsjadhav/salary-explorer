import EmployeeTable from './components/EmployeeTable';
import { AppBar, Toolbar, Typography } from '@mui/material';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Salary Explorer</Typography>
        </Toolbar>
      </AppBar>
      <EmployeeTable />
    </div>
  );
}

export default App;
