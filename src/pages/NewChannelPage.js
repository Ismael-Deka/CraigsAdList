/* eslint-disable react/jsx-no-bind */
import { useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import LoginErrorDialog from '../components/ui/js/misc/LoginErrorDialog';
import Card from '../components/ui/js/misc/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './css/LoginPage.module.css';

function NewChannelPage() {
  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const hideErrorDialog = useCallback(() => setIsErrorDialogOpen(false), []);
  const [name, setName] = useState('');
  const [subs, setSubs] = useState('');
  const [topics, setTopics] = useState('');
  const [price, setPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showChannel, setChannel] = useState(false);

  function setChannelName(text) {
    setName(text.target.value);
  }

  function setSubCount(text) {
    setSubs(text.target.value);
  }

  function setTopicList(text) {
    setTopics(text.target.value);
  }
  function setPreferredPrice(text) {
    setPrice(text.target.value);
  }

  function setShowChannel(checkbox) {
    if (checkbox.target.checked) {
      setChannel(true);
    } else {
      setChannel(false);
    }
  }
  function makeChannel() {
    if (name === '' || topics === '' || subs === '' || price === '') {
      setErrorMessage('Please enter all required fields correctly and fully');
      setIsErrorDialogOpen(true);
    } else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_name: name,
          topic_list: topics,
          sub_count: subs,
          preferred_price: price,
          show_channel: showChannel,
        }),
      };
      fetch(
        '/create_channel',
        requestOptions,
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setErrorMessage('Channel created Successful!');
            setIsErrorDialogOpen(true);
          } else {
            setErrorMessage('Error occured while creating channels');
            setIsErrorDialogOpen(true);
          }
        });
    }
  }

  return (
    <Card>
      <div>
        <div className={classes.welcome_logo}>Create a new Channel</div>
        <Form className="d-flex justify-content-center">
          <div>
            <Form.Group className="m-3" controlId="formBasicChannelName">
              <Form.Control type="channel" placeholder="Enter Channel Name" onChange={setChannelName} />
            </Form.Group>
            <Form.Group className="m-3" controlId="formBasicTopic">
              <Form.Control type="topics" placeholder="Enter Topics" onChange={setTopicList} />
            </Form.Group>
            <Form.Group className="m-3" controlId="formBasicPrice">
              <Form.Control type="price" placeholder="Enter Preferred Price" onChange={setPreferredPrice} />
            </Form.Group>
            <Form.Group className="m-3" controlId="formBasicSubs">
              <Form.Control type="subs" placeholder="Enter Subscriber Count" onChange={setSubCount} />
            </Form.Group>
          </div>

        </Form>
        <div>
          <div>
            Show Channel?
            <input type="checkbox" onChange={setShowChannel} />
          </div>
        </div>
        <Button variant="outline-secondary" onClick={makeChannel}>Submit</Button>

      </div>
      {IsErrorDialogOpen && (
        <LoginErrorDialog
          message={errorMessage}
          onCancel={hideErrorDialog}
        />
      )}
    </Card>

  );
}
export default NewChannelPage;
