import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import AdsPage from './pages/AdsPage';
import ChannelsPage from './pages/PlatformsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import NewAdPage from './pages/NewAdPage';
import NewChannelPage from './pages/NewChannelPage';
import NewResponsePage from './pages/NewResponsePage';
import NewOfferPage from './pages/NewOfferPage';
import MenuBar from './components/ui/js/MenuBar';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div>
      <MenuBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ads" element={<AdsPage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/new_add" element={<NewAdPage />} />
        <Route path="/new_channel" element={<NewChannelPage />} />
        <Route path="/new_response" element={<NewResponsePage />} />
        <Route path="/new_offer" element={<NewOfferPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
