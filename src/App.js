import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import MenuBar from './components/ui/js/menu_bar/MenuBar';
import UserProfilePage from './pages/UserProfilePage';
import PlatformProfilePage from './pages/PlatformProfilePage';
import InboxPage from './pages/InboxPage';
import NewPlatformPage from './pages/NewPlatformPage';
import SearchPage from './pages/SearchPage';
import CampaignProfilePage from './pages/CampaignProfilePage';

function App() {
  return (
    <div>
      <MenuBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/new_platform" element={<NewPlatformPage />} />
        <Route path="/profile/:id" element={<UserProfilePage />} />
        <Route path="/platform/:id" element={<PlatformProfilePage />} />
        <Route path="/campaign/:id" element={<CampaignProfilePage />} />
        <Route path="/messages/:folder" element={<InboxPage />} />
        <Route path="/search/:searchType" element={<SearchPage />} />
      </Routes>
    </div>
  );
}

export default App;
