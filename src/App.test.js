import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AdsPage from './pages/AdsPage';
import ChannelsPage from './pages/ChannelsPage';

it('renders welcome message', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  expect(screen.getByText('Welcome to the Landing Page!')).toBeInTheDocument();
});

it('renders filter on ads page', () => {
  render(<AdsPage />);
  expect(screen.getByText('Filter by:')).toBeInTheDocument();
});

it('renders filter on channels page', () => {
  render(<ChannelsPage />);
  expect(screen.getByText('Filter by:')).toBeInTheDocument();
});
