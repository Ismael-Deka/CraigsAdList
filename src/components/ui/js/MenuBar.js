import { useNavigate, useLocation } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Nav, Navbar,
} from 'react-bootstrap';
import classes from '../css/MenuBar.module.css';
import LoginErrorDialog from './LoginErrorDialog';
import ProfileButton from './ProfileButton';

function MenuBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(false);
  const [RedirectFunction, setRedirectFunction] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const navigateToAdsPage = useCallback(() => navigate('/'), [navigate]);
  function navigateBackToLogin() {
    navigate('/login');
  }
  const hideCloseHandler = useCallback(() => setIsErrorDialogOpen(false), []);

  useEffect(() => {
    fetch('/is_logged_in', {
      method: 'GET',
    }).then((reponse) => reponse.json().then((data) => {
      setIsLoggedIn(data.isuserloggedin);
      if (!data.isuserloggedin && location.pathname !== '/' && location.pathname !== '/login'
        && location.pathname !== '/signup' && location.pathname !== '/ads' && location.pathname !== '/channels') {
        setErrorMessage('Please log in.');
        setRedirectFunction(navigateBackToLogin);
        setIsErrorDialogOpen(true);
      } else {
        fetch('/get_current_user', {
          method: 'GET',
        }).then((userreponse) => userreponse.json().then((userdata) => {
          setCurrentUser(userdata.current_user);
        }));
      }
    }));
  });

  return (
    <div>
      <header className={classes.header}>
        <span className={classes.menu}>
          <Navbar.Brand href="/" style={{ color: 'black' }}>CraigsAdList</Navbar.Brand>
          <Nav className="me-auto" activeKey="/ads">
            <Nav.Item>
              <Nav.Link href="/ads" style={{ color: 'black' }}>Find Ads</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/channels" style={{ color: 'black' }}>Find Channels</Nav.Link>
            </Nav.Item>
          </Nav>

        </span>
        <div>
          <span className={classes.menu}>
            <ProfileButton profileName={currentUser} profilePictureUrl="https://lh3.googleusercontent.com/a/AATXAJyAoyxAHlPxYfdjPzbDWlo3nGAwjXr1qnwJ2ZST=s96-c" isLoggedIn={isLoggedIn} />
          </span>
        </div>
      </header>
      {IsErrorDialogOpen && (
        <LoginErrorDialog
          message={errorMessage}
          onCancel={hideCloseHandler}
          onRedirect={RedirectFunction}
        />
      )}
    </div>
  );
}

export default MenuBar;
