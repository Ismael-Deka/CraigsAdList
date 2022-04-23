import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

function ChannelItem(props) {
  const { channel, onReload } = props;
  const {
    id, ownerName, channelName, subscribers, topics, preferredReward,
  } = channel;
  const navigate = useNavigate();
  const location = useLocation();

  function makeOffer() {
    if (location.pathname !== '/new_offer') {
      navigate('/new_offer', { state: { selectedId: id } });
    } else {
      if (location.state !== null) {
        location.state.selectedId = id;
      }

      onReload();
      console.log(location.state);
    }
  }

  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title><h4><Badge pill bg="light" text="dark">{channelName}</Badge></h4></Card.Title>
          <Card.Text>
            <p>
              Topics:
              <br />
              {topics}
            </p>

            <p>
              Subscribers:
              <br />
              {subscribers}
            </p>

            <p>
              <b style={{ float: 'left' }}>
                Reward: $
                {preferredReward}
              </b>
              <b style={{ float: 'right' }}><Button variant="primary" onClick={() => makeOffer()}>Make offer</Button></b>
            </p>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted" style={{ float: 'left' }}>
            #
            {id}
          </small>
          <small className="text-muted" style={{ float: 'right' }}>
            by
            {' '}
            {ownerName}
          </small>
        </Card.Footer>
      </Card>
    </Col>
  );
}

export default ChannelItem;

ChannelItem.defaultProps = {
  channel: PropTypes.shape({
    id: 0,
    ownerName: '',
    channelName: '',
    subscribers: 0,
    topics: '',
    preferredReward: 0,
  }),
  onReload: () => { },
};
ChannelItem.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ownerName: PropTypes.string.isRequired,
    channelName: PropTypes.string.isRequired,
    subscribers: PropTypes.number.isRequired,
    topics: PropTypes.string,
    preferredReward: PropTypes.number,
  }),
  onReload: PropTypes.func,
};
