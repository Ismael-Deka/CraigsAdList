import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AdsPage from './pages/AdsPage';
import ChannelsPage from './pages/ChannelsPage';
import LandingPage from './pages/LandingPage';

it('renders filter on ads page', () => {
  render(<AdsPage />);
  expect(screen.getByText('Filter by:')).toBeInTheDocument();
});

it('renders filter on channels page', () => {
  render(<ChannelsPage />);
  expect(screen.getByText('Filter by:')).toBeInTheDocument();
});

it('renders creators on landing page', () => {
  render(<BrowserRouter><LandingPage /></BrowserRouter>);
  expect(screen.getByText('Made by: Ismael Deka, Subhash Tanikella, Pavel Popov, Utsav Patel (2022)')).toBeInTheDocument();
});
