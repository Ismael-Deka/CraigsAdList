/* eslint-disable react/jsx-no-bind */
import {
  useState, useEffect, useCallback,
} from 'react';
import { useLocation } from 'react-router';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import LoginErrorDialog from '../components/ui/js/LoginErrorDialog';
import ListOfChannels from '../components/ListofChannels';

function NewOfferPage() {
  let selectedId;

  const { state } = useLocation();
  if (state !== null) {
    selectedId = state.selectedId;
  } else {
    selectedId = -1;
  }

  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [ChannelName, setChannelName] = useState('');
  const [ownerId, setOwnerId] = useState(0);
  const [subscribers, setSubscibers] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const hideCloseHandler = useCallback(() => setIsErrorDialogOpen(false), []);

  function updateOffer() {
    if (state !== null) {
      selectedId = state.selectedId;
    } else {
      selectedId = -1;
    }
    fetch(`/return_selected_channel?id=${selectedId}`, {
      method: 'GET',
    }).then((reponse) => reponse.json().then((data) => {
      if (data.success === true) {
        setOwnerId(data.id);
        setChannelName(data.channelName);
        setSubscibers(data.subscribers);
        setPrice(data.preferredReward);
      }
    }));
  }

  function sendOffer() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel_name: ChannelName,
        owner_id: ownerId,
        price,
        message,
      }),
    };
    fetch(
      '/ad_offers',
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setErrorMessage('Offer created Successful!');
          setIsErrorDialogOpen(true);
        } else {
          setErrorMessage('Error occured while creating offer');
          setIsErrorDialogOpen(true);
        }
      });
  }

  useEffect(() => {
    updateOffer();
  }, []);

  return (
    <div>
      <Row class>
        <Col xs={8} md={4}>
          <div>
            <Card className="m-4" style={{ padding: '2rem' }}>
              <Card.Title>New Offer Page</Card.Title>
              <Card.Text>Channel Info: </Card.Text>

              <Card.Text>
                Channel Name:
                {ChannelName}
              </Card.Text>
              <Card.Text>
                Number of Subscribers:
                {subscribers}
              </Card.Text>
              <Card.Text>Topic:</Card.Text>
              <Card.Text>Prefered Contact:</Card.Text>

              <Card.Text>
                Preferred price of ads:
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                  <Form.Control name="maxReward" type="text" pattern="[0-9]*" value={price} onChange={(text) => setPrice(text.target.value)} />
                </InputGroup>
                / 1k subscribers

              </Card.Text>

              <Card.Text>Message (optional):</Card.Text>
              <Form>
                <Form.Control as="textarea" rows={3} onChange={(text) => { setMessage(text.target.value); }} />

              </Form>

              <Button variant="outline-secondary" onClick={sendOffer}>Make an Offer</Button>
            </Card>
          </div>
        </Col>
        <Col className="m-4">
          <ListOfChannels onReload={updateOffer} />
        </Col>
      </Row>
      {IsErrorDialogOpen && (
      <LoginErrorDialog
        message={errorMessage}
        onCancel={hideCloseHandler}
      />
      )}
    </div>
  );
}

export default NewOfferPage;
