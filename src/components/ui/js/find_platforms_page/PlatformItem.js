import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';

import OfferModal from '../OfferModal';

function PlatformItem(props) {
  const { platform } = props;
  const {
    id, ownerId, ownerName, platformName, subscribers, topics, preferredReward,
  } = platform;

  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title><h4><Badge pill bg="light" text="dark">{platformName}</Badge></h4></Card.Title>
          <Card.Text>
            <p>
              Topics:
              <br />
              {topics}
            </p>

            <p>
              Subscribers:
              <br />
              {subscribers.toLocaleString()}
            </p>

            <p>
              <b style={{ float: 'left' }}>
                Reward: $
                {preferredReward}
              </b>
              <OfferModal platformId={platform.id} />
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
            <a href={`/profile/${ownerId}`}>{ownerName}</a>
          </small>
        </Card.Footer>
      </Card>
    </Col>
  );
}

export default PlatformItem;

PlatformItem.defaultProps = {
  platform: PropTypes.shape({
    id: 0,
    ownerId: 0,
    ownerName: '',
    platformName: '',
    subscribers: 0,
    topics: '',
    preferredReward: 0,
  }),

};
PlatformItem.propTypes = {
  platform: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ownerId: PropTypes.number.isRequired,
    ownerName: PropTypes.string.isRequired,
    platformName: PropTypes.string.isRequired,
    subscribers: PropTypes.number.isRequired,
    topics: PropTypes.string,
    preferredReward: PropTypes.number,
  }),

};
