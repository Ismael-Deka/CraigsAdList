/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
import { useNavigate } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import LoginErrorDialog from '../components/ui/js/LoginErrorDialog';

function NewAdPage() {
  const navigate = useNavigate();
  const [title, setTitleText] = useState('');
  const [topics, setTopicsText] = useState('');
  const [text, setTextText] = useState('');
  const [reward, setRewardNumber] = useState('');
  const [show_in_list, setShow_in_list_Checkbox] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const hideCloseHandler = useCallback(() => setIsErrorDialogOpen(false), []);
  const navigateBackToLogin = useCallback(() => navigate('/login'), [navigate]);

  function isUserLoggedIn() {
    fetch('/is_logged_in', {
      method: 'GET',
    }).then((reponse) => reponse.json().then((data) => {
      if (data.isuserloggedin === false) {
        setIsErrorDialogOpen(true);
      }
    }));
  }

  useEffect(() => {
    isUserLoggedIn();
  }, []);
  function setTitle(text) {
    setTitleText(text.target.value);
  }
  function setTopics(text) {
    setTopicsText(text.target.value);
  }
  function setText(text) {
    setTextText(text.target.value);
  }
  function setReward(number) {
    setRewardNumber(number.target.value);
  }
  function setShow_In_List(checkbox) {
    if (checkbox.target.checked) {
      setShow_in_list_Checkbox(true);
    } else {
      setShow_in_list_Checkbox(false);
    }
  }

  function add_Ad() {
    if (title === '' || topics === '' || text === '' || reward === '' || show_in_list === '') {
      setErrorMessage('Please fill in all fields');
      setIsErrorDialogOpen(true);
    } else {
      const requestoptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          topics: topics,
          text: text,
          reward: reward,
          show_in_list: show_in_list,
        }),
      };
      fetch('/add_Ad', requestoptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.add_Ads_succesful === true) {
            setErrorMessage('The ad has been created');
            setIsErrorDialogOpen(true);
            console.log('The ad has been created');
          } else if (data.error_message === ' ') {
            setErrorMessage('Something went wrong');
            setIsErrorDialogOpen(true);
          } else {
            setErrorMessage(data.error_message);
            setIsErrorDialogOpen(true);
          }
        });
    }
  }

  return (
    <div>
      {IsErrorDialogOpen && (
      <LoginErrorDialog
        message={errorMessage}
        onCancel={hideCloseHandler}
        onRedirect={navigateBackToLogin}
      />
      )}

      <input type="text" onChange={setTitle} placeholder="title" />
      <input type="text" onChange={setTopics} placeholder="topics" />
      <input type="text" onChange={setText} placeholder="text" />
      <input type="number" onChange={setReward} placeholder="reward" />
      <input type="checkbox" onChange={setShow_In_List} />
      <button type="submit" onClick={add_Ad}>Submit</button>
      <h1>Welcome to the New Ad Page!</h1>
      <ul>
        <li><a href="/">Go to AdsPage</a></li>
        <li><a href="/channels">Go to ChannelsPage</a></li>
        <li><a href="/acount">Go to UserAccountPage</a></li>
        <li><a href="/new_add">Go to NewAdPage</a></li>
        <li><a href="/new_channel">Go to NewChannelPage</a></li>
        <li><a href="/new_response">Go to NewResponsePage</a></li>
        <li><a href="/new_offer">Go to NewOfferPage</a></li>
      </ul>
    </div>
  );
}

export default NewAdPage;
