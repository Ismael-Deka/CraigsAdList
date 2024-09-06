/* eslint-disable react/jsx-no-bind */
import Button from 'react-bootstrap/Button';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Form, Card } from 'react-bootstrap';
// import Card from '../components/ui/js/misc/Card';
import LoginErrorDialog from '../components/ui/js/misc/LoginErrorDialog';
import classes from './css/LoginSignupPage.module.css';

function LoginPage() {
  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [emailText, setemailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [RedirectFunction, setRedirectFunction] = useState({});

  const navigate = useNavigate();

  const hideErrorDialog = useCallback(() => setIsErrorDialogOpen(false), []);
  const navigateToHomePage = useCallback(() => navigate('/'), [navigate]);

  function setEmail(text) {
    setemailText(text.target.value);
  }

  function setPassword(text) {
    setPasswordText(text.target.value);
  }

  function logIn() {
    if (emailText === '' || passwordText === '') {
      setErrorMessage('Please enter your Email and Password');
      setIsErrorDialogOpen(true);
    } else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailText, password: passwordText }),
      };
      fetch('/handle_login', requestOptions).then((reponse) => reponse.json().then((data) => {
        if (data.is_login_successful === true) {
          setErrorMessage('Log In Successful!');
          setRedirectFunction(navigateToHomePage);
          setIsErrorDialogOpen(true);
        } else if (data.error_message === '') {
          setErrorMessage('Unable to login. Please Try again.');
          setIsErrorDialogOpen(true);
        } else {
          setErrorMessage(data.error_message);
          setIsErrorDialogOpen(true);
        }
      }));
    }
  }

  return (
    <div>
      <Card style={{
        marginTop: '5vh',
        display: 'block',
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        padding: '50px',
      }}
      >
        <div>
          <div className={classes.welcome_logo}>Log-In</div>
          <Form className="d-flex justify-content-center">
            <div>
              <Form.Group className="m-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" onChange={setEmail} />
              </Form.Group>
              <Form.Group className="m-3" controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" onChange={setPassword} />
              </Form.Group>
            </div>

          </Form>

          <Button variant="outline-secondary" onClick={logIn}>Submit</Button>

          <div>
            Login to your account or
            {' '}
            <a href="/signup">Sign up</a>
          </div>
          {IsErrorDialogOpen && (
            <LoginErrorDialog
              message={errorMessage}
              onCancel={hideErrorDialog}
              onRedirect={RedirectFunction}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
