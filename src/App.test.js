import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

it('renders creators on landing page', () => {
  render(<BrowserRouter><LandingPage /></BrowserRouter>);
  expect(screen.getByText('Made by: Ismael Deka, Subhash Tanikella, Pavel Popov, Utsav Patel (2022)')).toBeInTheDocument();
});
