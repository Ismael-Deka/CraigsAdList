import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  Nav, Navbar, Form, InputGroup, FormControl, Button, ListGroup,
} from 'react-bootstrap';
import classes from '../css/MenuBar.module.css';
import LoginErrorDialog from './LoginErrorDialog';
import ProfileButton from './ProfileButton';
import { ReactComponent as SiteBrand } from '../../../images/cal_icon2.svg';

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
    redirectFunction: {},
    isLoggedIn: false,
    screenSize: window.innerWidth,
    query: '',
    searchResults: [],
  });

  // Dummy data for search results
  const dummyData = [
    { id: 1, name: 'Result 1' },
    { id: 2, name: 'Result 2' },
    { id: 3, name: 'Result 3' },
    // Add more dummy data as needed
  ];
  const handleSearch = () => {
    const filteredResults = dummyData.filter(
      (result) => result.name.toLowerCase().includes(state.query.toLowerCase()),
    );
    setState((prevState) => ({ ...prevState, searchResults: filteredResults }));
  };

  const navigateBackToLogin = () => {
    navigate('/login');
  };

  const hideCloseHandler = useCallback(() => setState(
    (prevState) => (
      { ...prevState, isErrorDialogOpen: false }
    ),
  ), []);

  const logOut = useCallback(() => {
    fetch('/handle_logout', {
      method: 'POST',
    }).then((response) => response.json().then((data) => {
      if (data.isuserloggedin === true) {
        setState((prevState) => ({ ...prevState, errorMessage: 'Something went wrong. Please try again.', isErrorDialogOpen: true }));
      } else {
        setState((prevState) => ({
          ...prevState, errorMessage: 'User Logged out Successfully', isLoggedIn: false, redirectFunction: navigateBackToLogin, isErrorDialogOpen: true,
        }));
      }
    }));
  }, [navigateBackToLogin]);

  useEffect(() => {
    if (location.pathname !== state.currentUrl) {
      setState({ ...state, currentUrl: location.pathname });
    }
  }, [location.pathname]);

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
    console.log(location.pathname);
    const fetchData = async () => {
      try {
        const isLoggedInResponse = await fetch('/is_logged_in', { method: 'GET' });
        const isLoggedInData = await isLoggedInResponse.json();
        setState((prevState) => ({ ...prevState, isLoggedIn: isLoggedInData.isuserloggedin }));

        if (!isLoggedInData.isuserloggedin && location.pathname !== '/' && location.pathname !== '/login'
          && location.pathname !== '/signup' && location.pathname !== '/ads' && location.pathname !== '/channels') {
          setState((prevState) => ({
            ...prevState, errorMessage: 'Please log in.', redirectFunction: navigateBackToLogin, isErrorDialogOpen: true,
          }));
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
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [state.currentUrl]);

  const menuItems = [
    {
      size: 320,
      component:
  <Navbar.Brand href="/" style={{ color: 'black' }}>
    <SiteBrand width={40} height={40} />
    {state.screenSize >= 603 && (<span style={{ fontFamily: 'monospace' }}>CraigsAdList</span>)}
  </Navbar.Brand>,
    },
    { size: 830, component: <Nav.Link href="/ads" style={{ color: 'black' }}>Find Campaigns</Nav.Link> },
    { size: 1003, component: <Nav.Link href="/channels" style={{ color: 'black' }}>Find Platforms</Nav.Link> },
  ];

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
        {(state.screenSize < 573)
          ? (<Button id={classes.mobileSearchBar}>Search</Button>)
          : (
            <Form inline className="my-2 my-lg-0 mx-auto mr-4">
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Search"
                  style={{ width: '30vw' }}
                  className={`${classes.searchBar} mr-sm-2`}
                  value={state.query}
                  onChange={(e) => {
                    setState({ ...state, query: e.target.value });
                    if (state.query.length > 2) handleSearch();
                  }}
                  onBlur={() => { setState({ ...state, searchResults: [] }); }}
                />
                <Button variant="outline-light" className={classes.search_bar_clear} onClick={() => { setState({ ...state, query: '' }); setState({ ...state, searchResults: [] }); }}>X</Button>
              </InputGroup>
              {state.searchResults.length > 0 && state.query.length > 2 && (
              <ListGroup className="position-absolute mt-1 w-100" style={{ zIndex: 1000 }}>
                {state.searchResults.map((result) => (
                  <ListGroup.Item key={result.id}>{result.name}</ListGroup.Item>
                ))}
              </ListGroup>
              )}
            </Form>
          )}

        <div>

          <ProfileButton
            profileName={state.currentUser}
            profilePictureUrl={state.currentUserPfp}
            isLoggedIn={state.isLoggedIn}
            logOut={logOut}
            isMobile={state.screenSize <= 430}
            id={state.currentUserId}
          />

        </div>
      </header>
      {state.IsErrorDialogOpen && (
        <LoginErrorDialog
          message={state.errorMessage}
          onCancel={hideCloseHandler}
          onRedirect={state.RedirectFunction}
        />
      )}
    </div>
  );
}

export default MenuBar;
