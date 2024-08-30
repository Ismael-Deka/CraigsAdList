import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import AdsPage from './pages/AdsPage';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import NewAdPage from './pages/NewAdPage';

import NewResponsePage from './pages/NewResponsePage';
import NewOfferPage from './pages/NewOfferPage';
import MenuBar from './components/ui/js/MenuBar';
import ProfilePage from './pages/ProfilePage';
import PlatformPage from './pages/PlatformPage';
import InboxPage from './pages/InboxPage';
import NewPlatformPage from './pages/NewPlatformPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <div>
      <MenuBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ads" element={<AdsPage />} />
        <Route path="/search/:searchType" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/new_add" element={<NewAdPage />} />
        <Route path="/new_channel" element={<NewPlatformPage />} />
        <Route path="/new_response" element={<NewResponsePage />} />
        <Route path="/new_offer" element={<NewOfferPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/platform/:id" element={<PlatformPage />} />
        <Route path="/messages/:folder" element={<InboxPage />} />
      </Routes>
    </div>
  );
}

export default App;
