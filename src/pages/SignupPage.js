import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import LoginErrorDialog from '../components/ui/js/LoginErrorDialog';
import Card from '../components/ui/js/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        Welcome to the SignupPage!
        <div><input type="text" onChange={setUsername} placeholder="Enter Username" /></div>
        <div><input type="text" onChange={setEmail} placeholder="Enter Email" /></div>
        <div><input type="password" onChange={setPassword} placeholder="Enter Password" /></div>
        <div>
          <div>
            Channel Owner
            <input type="checkbox" onChange={setChannelOwner} placeholder="Enter Channel Owner" />
          </div>
        </div>
        <button type="submit" onClick={signUp}>Submit</button>
        <div>
          Already have an account?
          {' '}
          <a href="/login">Log in.</a>
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
  );
}

export default LoginPage;
