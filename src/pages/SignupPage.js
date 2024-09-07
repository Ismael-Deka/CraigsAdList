import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Form, Button, Card, Col, Row, Container, ButtonGroup, ToggleButton,
} from 'react-bootstrap';
import LoginErrorDialog from '../components/ui/js/misc/LoginErrorDialog';
import ImageSelectForm from '../components/ui/js/misc/ImageSelectForm'; // Import ImageSelectForm
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './css/LoginSignupPage.module.css';

function SignupPage() {
  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 603);
  const [isScreenSmall, setSmallScreen] = useState(window.innerWidth < 1440);
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [confirmPasswordText, setConfirmPasswordText] = useState(''); // Password confirmation field
  const [firstNameText, setFirstNameText] = useState('');
  const [lastNameText, setLastNameText] = useState('');
  const [role, setRole] = useState('advertiser'); // Platform Owner / Advertiser role
  const [localPfp, setLocalPfp] = useState('https://craigsadslist-cloud-object-storage-cos-standard-6ik.s3.us-east.cloud-object-storage.appdomain.cloud/default.png'); // Default profile picture
  const [currentPfp, setCurrentPfp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameText, setUsernameText] = useState('FirstName.LastName');
  const [RedirectFunction, setRedirectFunction] = useState({});
  const navigate = useNavigate();

  const hideErrorDialog = useCallback(() => setIsErrorDialogOpen(false), []);
  const navigateBackToLogin = useCallback(() => navigate('/login'), [navigate]);

  const setEmail = (text) => {
    setEmailText(text.target.value);
  };

  const setPassword = (text) => {
    setPasswordText(text.target.value);
  };

  const setConfirmPassword = (text) => {
    setConfirmPasswordText(text.target.value);
  };

  const setFirstName = (text) => {
    setFirstNameText(text.target.value);
  };

  const setLastName = (text) => {
    setLastNameText(text.target.value);
  };

  // Debounced resize handler
  const handleWindowResize = useCallback(() => {
    setIsMobile(window.innerWidth < 603);
    setSmallScreen(window.innerWidth < 1440);
  }, []);

  useEffect(() => {
    let timeoutId = null;

    const debouncedResizeHandler = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        handleWindowResize();
      }, 100); // Adjust the delay (200ms) as needed
    };

    // Add event listener for window resize
    window.addEventListener('resize', debouncedResizeHandler);

    // Cleanup function to remove event listener and clear any pending timeouts
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleWindowResize]);

  useEffect(() => {
    setUsernameText(`${firstNameText !== '' ? firstNameText.toLocaleLowerCase() : 'First Name'}.${lastNameText !== '' ? lastNameText.toLocaleLowerCase() : 'Last Name'}`);
  }, [firstNameText, lastNameText]);

  useEffect(() => {
    document.title = 'Sign-up - CraigsAdList';
  }, []);

  // Function to handle profile picture selection
  const handleProfilePictureChange = (event) => {
    const selectedPfp = event.target.files[0];
    const reader = new FileReader();
    setCurrentPfp(selectedPfp);
    reader.readAsDataURL(selectedPfp);

    reader.onload = () => {
      const base64Pfp = reader.result;
      setLocalPfp(base64Pfp);
    };
  };

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function generateAvailableUsername(baseUsername) {
    let suffix = 0;
    const newUsername = baseUsername;

    // Recursive function to check username availability
    function checkUsername(username) {
      return fetch(`/is_username_taken?username=${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.is_username_taken) {
            // If the username is taken, append a number and try again
            suffix += 1;
            return checkUsername(`${baseUsername}${suffix}`);
          }

          // Username is available, return it
          return username;
        });
    }

    // Start checking from the base username
    return checkUsername(newUsername);
  }

  const signUp = async () => {
    if (
      usernameText === ''
      || emailText === ''
      || passwordText === ''
      || confirmPasswordText === ''
      || firstNameText === ''
      || lastNameText === ''
    ) {
      setErrorMessage('Please enter all required fields correctly and fully');
      setIsErrorDialogOpen(true);
    } else if (!validateEmail(emailText)) {
      setErrorMessage('Please enter a valid email address');
      setIsErrorDialogOpen(true);
    } else if (passwordText !== confirmPasswordText) {
      setErrorMessage('Passwords do not match');
      setIsErrorDialogOpen(true);
    } else {
      // Generate an available username
      const baseUsername = `${firstNameText.toLocaleLowerCase()}.${lastNameText.toLocaleLowerCase()}`;
      generateAvailableUsername(baseUsername).then((availableUsername) => {
        const formData = new FormData();
        formData.append('username', availableUsername);
        formData.append('email', emailText);
        formData.append('password', passwordText);
        formData.append('full_name', `${firstNameText} ${lastNameText}`);
        formData.append('platform_owner', role === 'platform_owner');
        formData.append('profile_pic', currentPfp);
        formData.append('new_pfp_chosen', currentPfp !== '');

        const requestOptions = {
          method: 'POST',
          body: formData,
        };
        fetch('/handle_signup', requestOptions).then((response) => response.json().then((data) => {
          if (data.is_signup_successful === true) {
            setErrorMessage('Sign Up Successful!');
            setRedirectFunction(navigateBackToLogin);
            setIsErrorDialogOpen(true);
          } else if (data.error_message === '') {
            setErrorMessage('Unable to signup. Please try again.');
            setIsErrorDialogOpen(true);
          } else {
            setErrorMessage(data.error_message);
            setIsErrorDialogOpen(true);
          }
        }));
      });
    }
  };

  return (
    <Card
      style={!isMobile ? {
        marginTop: '5vh',
        display: 'block',
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        padding: '50px',
      } : {
        marginTop: '5vh',
        display: 'block',
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        padding: '50px',
      }}
    >
      <Container>
        <Col>
          <div className={classes.welcome_logo}>Sign Up</div>
          <ImageSelectForm
            currentProfilePic={localPfp}
            handleProfilePictureChange={handleProfilePictureChange}
            imgSize="medium"
          />
          {!isScreenSmall && (
            <Form className="m-3">

              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} md="4" controlId="formBasicFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="First Name" value={firstNameText} onChange={setFirstName} />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formBasicLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Last Name" value={lastNameText} onChange={setLastName} />
                </Form.Group>
              </Row>
              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} md="8" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Username" value={usernameText} readOnly />
                </Form.Group>
              </Row>
              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} md="8" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Email" value={emailText} onChange={setEmail} />
                </Form.Group>
              </Row>

              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} md="4" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={passwordText} onChange={setPassword} />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formBasicConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm Password" value={confirmPasswordText} onChange={setConfirmPassword} />
                </Form.Group>
              </Row>

              <ButtonGroup className="m-3">
                <ToggleButton
                  type="radio"
                  variant={role === 'platform_owner' ? 'secondary' : 'outline-secondary'}
                  name="radio"
                  value="platform_owner"
                  checked={role === 'platform_owner'}
                  onClick={() => setRole('platform_owner')}
                >
                  Platform Owner
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant={role === 'advertiser' ? 'secondary' : 'outline-secondary'}
                  name="radio"
                  value="advertiser"
                  checked={role === 'advertiser'}
                  onClick={() => setRole('advertiser')}
                >
                  Advertiser
                </ToggleButton>
              </ButtonGroup>

            </Form>
          )}
          {isScreenSmall && (
            <Form className="m-3">

              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} controlId="formBasicFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="First Name" value={firstNameText} onChange={setFirstName} />
                </Form.Group>
              </Row>
              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} controlId="formBasicLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Last Name" value={lastNameText} onChange={setLastName} />
                </Form.Group>
              </Row>
              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Username" value={usernameText} readOnly />
                </Form.Group>
              </Row>
              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Email" value={emailText} onChange={setEmail} />
                </Form.Group>
              </Row>

              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={passwordText} onChange={setPassword} />
                </Form.Group>
              </Row>
              <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} controlId="formBasicConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm Password" value={confirmPasswordText} onChange={setConfirmPassword} />
                </Form.Group>
              </Row>

              {!isMobile && (
                <ButtonGroup className="m-3">
                  <ToggleButton
                    type="radio"
                    variant={role === 'platform_owner' ? 'secondary' : 'outline-secondary'}
                    name="radio"
                    value="platform_owner"
                    checked={role === 'platform_owner'}
                    onClick={() => setRole('platform_owner')}
                  >
                    Platform Owner
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant={role === 'advertiser' ? 'secondary' : 'outline-secondary'}
                    name="radio"
                    value="advertiser"
                    checked={role === 'advertiser'}
                    onClick={() => setRole('advertiser')}
                  >
                    Advertiser
                  </ToggleButton>
                </ButtonGroup>
              )}
              {isMobile && (
                <ButtonGroup className="m-3">
                  <ToggleButton
                    size="sm"
                    type="radio"
                    variant={role === 'platform_owner' ? 'secondary' : 'outline-secondary'}
                    name="radio"
                    value="platform_owner"
                    checked={role === 'platform_owner'}
                    onClick={() => setRole('platform_owner')}
                  >
                    Platform Owner
                  </ToggleButton>
                  <ToggleButton
                    size="sm"
                    type="radio"
                    variant={role === 'advertiser' ? 'secondary' : 'outline-secondary'}
                    name="radio"
                    value="advertiser"
                    checked={role === 'advertiser'}
                    onClick={() => setRole('advertiser')}
                  >
                    Advertiser
                  </ToggleButton>
                </ButtonGroup>
              )}

            </Form>
          )}

          <Button variant="outline-secondary" onClick={signUp}>
            Submit
          </Button>
          {IsErrorDialogOpen && (
            <LoginErrorDialog
              message={errorMessage}
              onCancel={hideErrorDialog}
              onRedirect={RedirectFunction}
            />
          )}
        </Col>
      </Container>
    </Card>
  );
}

export default SignupPage;
