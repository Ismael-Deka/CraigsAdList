import { useNavigate, useLocation } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Nav, Navbar, Dropdown, DropdownButton, Button,
} from 'react-bootstrap';
import classes from './css/MenuBar.module.css';
import LoginErrorDialog from './ui/js/LoginErrorDialog';
import MenuNavigation from './MenuNavigation';

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

  const logOut = useCallback(() => {
    fetch('/handle_logout', {
      method: 'POST',
    }).then((reponse) => reponse.json().then((data) => {
      if (data.isuserloggedin === true) {
        setErrorMessage('Something went wrong. Please try again.');
        setIsErrorDialogOpen(true);
      } else {
        setErrorMessage('User Logged out Successfully');
        setIsLoggedIn(false);
        setRedirectFunction(navigateBackToLogin);
        setIsErrorDialogOpen(true);
      }
    }));
  }, [navigateBackToLogin]);

  useEffect(() => {
    fetch('/is_logged_in', {
      method: 'GET',
    }).then((reponse) => reponse.json().then((data) => {
      setIsLoggedIn(data.isuserloggedin);
      if (!data.isuserloggedin && location.pathname !== '/' && location.pathname !== '/login'
        && location.pathname !== '/signup' && location.pathname !== '/ads' && location.pathname !== '/channels') {
        setErrorMessage('User is Logged out');
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
            {isLoggedIn && (<Button variant="outline-secondary" href="/new_add" style={{ fontWeight: 'bold' }}>+</Button>)}

            <DropdownButton title="Settings" variant="secondary">
              {!isLoggedIn && (
                <div>
                  <Dropdown.Item>Not Logged In</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/login">Log In</Dropdown.Item>
                  <Dropdown.Item href="/signup">Sign Up</Dropdown.Item>
                </div>
              )}
              {isLoggedIn && (
                <div>

                  <MenuNavigation />
                  <Dropdown.Divider />

                  <Dropdown.ItemText>
                    Signed in as:
                    {' '}
                    <a href="/acount">{currentUser}</a>
                  </Dropdown.ItemText>

                  <Dropdown.Item onClick={logOut}>Log out</Dropdown.Item>
                </div>
              )}
            </DropdownButton>
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
