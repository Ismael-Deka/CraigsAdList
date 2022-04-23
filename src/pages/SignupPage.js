/* eslint-disable react/jsx-no-bind */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Form, Button } from 'react-bootstrap';
import LoginErrorDialog from '../components/ui/js/LoginErrorDialog';
import Card from '../components/ui/js/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './css/LoginPage.module.css';

function LoginPage() {
  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [usernameText, setUsernameText] = useState('');
  const [emailText, setemailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [channelChecked, setChannelChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [RedirectFunction, setRedirectFunction] = useState({});

  const navigate = useNavigate();

  const hideErrorDialog = useCallback(() => setIsErrorDialogOpen(false), []);
  const navigateBackToLogin = useCallback(() => navigate('/login'), [navigate]);

  function setUsername(text) {
    setUsernameText(text.target.value);
  }

  function setEmail(text) {
    setemailText(text.target.value);
  }

  function setPassword(text) {
    setPasswordText(text.target.value);
  }

  function setChannelOwner(checkbox) {
    if (checkbox.target.checked) {
      setChannelChecked(true);
    } else {
      setChannelChecked(false);
    }
  }

  function signUp() {
    if (usernameText === '' || emailText === '' || passwordText === '') {
      setErrorMessage('Please enter all required fields correctly and fully');
      setIsErrorDialogOpen(true);
    } else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameText,
          email: emailText,
          password: passwordText,
          channel_owner: channelChecked,
        }),
      };
      fetch('/handle_signup', requestOptions).then((reponse) => reponse.json().then((data) => {
        if (data.is_signup_successful === true) {
          setErrorMessage('Sign Up Successful!');
          setRedirectFunction(navigateBackToLogin);
          setIsErrorDialogOpen(true);
        } else if (data.error_message === '') {
          setErrorMessage('Unable to signup. Please Try again.');
          setIsErrorDialogOpen(true);
        } else {
          setErrorMessage(data.error_message);
          setIsErrorDialogOpen(true);
        }
      }));
    }
  }

  return (
    <Card>
      <div>
        <div className={classes.welcome_logo}>Sign Up</div>
        <Form className="d-flex justify-content-center">
          <div>
            <Form.Group className="m-3" controlId="formBasicUsername">
              <Form.Control type="username" placeholder="Enter Username" onChange={setUsername} />
            </Form.Group>
            <Form.Group className="m-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Enter email" onChange={setEmail} />
            </Form.Group>
            <Form.Group className="m-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Password" onChange={setPassword} />
            </Form.Group>
          </div>

        </Form>
        <div>
          <div>
            Channel Owner
            <input type="checkbox" onChange={setChannelOwner} placeholder="Enter Channel Owner" />
          </div>
        </div>
        <Button variant="outline-secondary" onClick={signUp}>Submit</Button>

        {IsErrorDialogOpen && (
        <LoginErrorDialog
          message={errorMessage}
          onCancel={hideErrorDialog}
          onRedirect={RedirectFunction}
        />
        )}
      </div>
    </Card>
  );
}

export default LoginPage;
