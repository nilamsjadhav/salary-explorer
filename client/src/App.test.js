import { render, screen } from '@testing-library/react';
import App from './App';

test('should display welcome message', () => {
  render(<App />);
  const message = screen.getByText(/Welcome to Salary Explorer/i);
  expect(message).toBeInTheDocument();
});
