import { useNavigate, useLocation } from 'react-router-dom';
import {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import classes from '../../css/MenuBar.module.css';
import LoginErrorDialog from '../misc/LoginErrorDialog';
import ProfileButton from './ProfileButton';
import { ReactComponent as SiteBrand } from '../../../../images/cal_icon2.svg';
import SearchBar from './SearchField';

function MenuBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({
    currentUrl: location.pathname,
    isErrorDialogOpen: false,
    errorMessage: '',
    currentUser: '',
    currentUserId: '',
    currentUserPfp: '',
    isLoggedIn: false,
    screenSize: window.innerWidth,
  });

  const navigateBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const hideCloseHandler = useCallback(() => {
    setState((prevState) => ({ ...prevState, isErrorDialogOpen: false }));
  }, []);

  const logOut = useCallback(() => {
    fetch('/handle_logout', {
      method: 'POST',
    }).then((response) => response.json().then((data) => {
      if (data.isuserloggedin) {
        setState((prevState) => ({
          ...prevState,
          errorMessage: 'Something went wrong. Please try again.',
          isErrorDialogOpen: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          errorMessage: 'User Logged out Successfully',
          isLoggedIn: false,
          isErrorDialogOpen: true,
        }));
        window.location.reload();
      }
    }));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setState((prevState) => ({ ...prevState, screenSize: window.innerWidth }));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isLoggedInResponse = await fetch('/is_logged_in', { method: 'GET' });
        const isLoggedInData = await isLoggedInResponse.json();
        setState((prevState) => ({ ...prevState, isLoggedIn: isLoggedInData.isuserloggedin }));

        if (!isLoggedInData.isuserloggedin && !['/', '/login', '/signup', '/ads', '/channels'].includes(location.pathname)) {
          setState((prevState) => ({
            ...prevState,
            errorMessage: 'Please log in.',
            isErrorDialogOpen: true,
          }));
          navigateBackToLogin();
        } else {
          const storedUserData = JSON.parse(localStorage.getItem('userData'));

          if (storedUserData) {
            setState((prevState) => ({
              ...prevState,
              currentUser: storedUserData.current_user,
              currentUserId: storedUserData.id,
              currentUserPfp: storedUserData.pfp,
            }));
          } else {
            const response = await fetch('/get_current_user', { method: 'GET' });
            if (response.ok) {
              const currentUserData = await response.json();
              setState((prevState) => ({
                ...prevState,
                currentUser: currentUserData.current_user,
                currentUserId: currentUserData.id,
                currentUserPfp: currentUserData.pfp,
              }));
              localStorage.setItem('userData', JSON.stringify(currentUserData));
            } else {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [location.pathname]);

  const menuItems = useMemo(() => [
    {
      size: 320,
      component: (
        <Navbar.Brand href="/" style={{ color: 'black' }}>
          <SiteBrand width={40} height={40} />
          {state.screenSize >= 603 && <span style={{ fontFamily: 'monospace' }}>CraigsAdList</span>}
        </Navbar.Brand>
      ),
    },
    { size: 1003, component: <Nav.Link href="/search/platforms" style={{ color: 'black' }}>Find Platforms</Nav.Link> },
    { size: 830, component: <Nav.Link href="/search/campaigns" style={{ color: 'black' }}>Find Campaigns</Nav.Link> },
  ], [state.screenSize]);

  return (
    <div>
      <header className={classes.header}>
        <span className={classes.menu}>
          <Nav className="me-auto" activeKey="/ads" style={{ alignItems: 'center' }}>
            {menuItems.map((item) => state.screenSize >= item.size && (
              <Nav.Item key={item.size}>
                {item.component}
              </Nav.Item>
            ))}
          </Nav>
        </span>

        {state.screenSize < 573 ? (
          <Button id={classes.mobileSearchBar}>Search</Button>
        ) : (
          <SearchBar /> // Include the new SearchBar component here
        )}

        <ProfileButton
          profileName={state.currentUser}
          profilePictureUrl={state.currentUserPfp}
          isLoggedIn={state.isLoggedIn}
          logOut={logOut}
          isMobile={state.screenSize <= 430}
          id={state.currentUserId}
        />
      </header>
      {state.isErrorDialogOpen && (
        <LoginErrorDialog
          message={state.errorMessage}
          onCancel={hideCloseHandler}
          onRedirect={navigateBackToLogin}
        />
      )}
    </div>
  );
}

export default MenuBar;
