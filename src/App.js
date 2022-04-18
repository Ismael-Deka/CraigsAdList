import { Routes, Route } from 'react-router';
import './App.css';
import AdsPage from './pages/AdsPage';
import ChannelsPage from './pages/ChannelsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserAccountPage from './pages/UserAccountPage';
import NewAdPage from './pages/NewAdPage';
import NewChannelPage from './pages/NewChannelPage';
import NewResponsePage from './pages/NewResponsePage';
import NewOfferPage from './pages/NewOfferPage';
import MenuBar from './components/MenuBar';

function App() {
  return (
    <div>
      <MenuBar />
      <Routes>
        <Route path="/" element={<AdsPage />} />
        <Route path="/ads" element={<AdsPage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/acount" element={<UserAccountPage />} />
        <Route path="/new_add" element={<NewAdPage />} />
        <Route path="/new_channel" element={<NewChannelPage />} />
        <Route path="/new_response" element={<NewResponsePage />} />
        <Route path="/new_offer" element={<NewOfferPage />} />
      </Routes>
    </div>
  );
}

export default App;
