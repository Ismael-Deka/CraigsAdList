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
  const { state } = useLocation();
  const { selectedId } = state;

  const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [ChannelName, setChannelName] = useState('');
  const [subscribers, setSubscibers] = useState('');
  const [price, setPrice] = useState('');

  const hideCloseHandler = useCallback(() => setIsErrorDialogOpen(false), []);
  const showCloseHandler = useCallback(() => setIsErrorDialogOpen(true), []);

  useEffect(() => {
    fetch(`/return_selected_channel?id=${selectedId}`, {
      method: 'GET',
    }).then((reponse) => reponse.json().then((data) => {
      setChannelName(data.channelName);
      setSubscibers(data.channels_data[0].subscribers);
      setPrice(data.preferredReward);
    }));
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
          <ListOfChannels />
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

export default NewOfferPage;
