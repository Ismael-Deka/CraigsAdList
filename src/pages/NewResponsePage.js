/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
// import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import LoginErrorDialog from '../components/ui/js/LoginErrorDialog';
// import ListOfAds from '../components/ListofAds';

function NewResponsePage() {
  // const navigate = useNavigate();

  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  // const [message, setMessage] = useState('');
  // const [RedirectFunction, setRedirectFunction] = useState({});

  // const { state } = useLocation();
  // const { selected_channel_id } = state;

  // const [ads, setAds] = useState([]);

  const [ChannelName, setChannelName] = useState('');
  const [subscribers, setSubscibers] = useState('');
  const [price, setPrice] = useState('');

  function hideCloseHandler() {
    setIsErrorDialogOpen(false);
  }

  function showCloseHandler() {
    setIsErrorDialogOpen(true);
  }

  /* useEffect(() => {
    fetch('/channelowner', {
      method: 'GET',
    }).then((reponse) => reponse.json().then((data) => {
      if (data.is_user_channel_owner === false) {
        navigate('/');
      }
    }));
  }); */

  /* useEffect(() => {
    fetch(`/return_selected_ad?id=${selectedId}`, {
      method: 'GET',
    }).then((reponse) => reponse.json().then((data) => {
      setChannelName(data.title);
      setSubscibers(data.channels_data[0].subscribers);
      setPrice(data.preferredReward);
    }));
  }, []); */

  return (
    <div>
      <Row class>
        <Col xs={8} md={4}>
          <div>
            <Card className="m-4" style={{ padding: '2rem' }}>
              <Card.Title>New Response Page</Card.Title>
              <Card.Text>Ad Info: </Card.Text>

              <Card.Text>
                Ad Name:
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
                  <Form.Control name="maxReward" type="text" pattern="[0-9]*" value={price} />
                </InputGroup>
                / 1k subscribers

              </Card.Text>

              <Card.Text>Message (optional):</Card.Text>
              <Form>
                <Form.Control as="textarea" rows={3} />

              </Form>

              <Button variant="outline-secondary" onClick={showCloseHandler}>Make an Offer</Button>
            </Card>
          </div>
        </Col>
        <Col className="m-4">
          { /* <ListOfChannels /> */}
        </Col>
      </Row>

      {IsErrorDialogOpen && (
        <LoginErrorDialog
          message="Placeholder. Will complete when Email processing is implemented"
          onCancel={hideCloseHandler}
        />
      )}
    </div>
  );
}

export default NewResponsePage;
