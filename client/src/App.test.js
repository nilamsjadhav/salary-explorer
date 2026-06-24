import { render, screen } from '@testing-library/react';
import App from './App';

test('should display Salary Explorer heading', () => {
  render(<App />);
  const heading = screen.getByText(/Salary Explorer/i);
  expect(heading).toBeInTheDocument();
});
