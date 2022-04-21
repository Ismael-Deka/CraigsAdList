import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

it('renders welcome message', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  expect(screen.getByText('Welcome to the Landing Page!')).toBeInTheDocument();
});
