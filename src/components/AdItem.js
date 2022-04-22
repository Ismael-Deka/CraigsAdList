import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

function AdItem(props) {
  const { ad } = props;
  const {
    id, creatorName, title, topics, text, reward,
  } = ad;
  const navigate = useNavigate();

  function makeResponse() {
    navigate('/new_response', { selected_id: id });
  }

  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title><h4><Badge pill bg="light" text="dark">{title}</Badge></h4></Card.Title>
          <Card.Text>
            <p>
              Topics:
              <br />
              {topics}
            </p>

            <p>
              Text:
              <br />
              {text}
            </p>

            <p>
              <b style={{ float: 'left' }}>
                Reward: $
                {reward}
              </b>
              <b style={{ float: 'right' }}><Button variant="primary" onClick={() => makeResponse()}>Respond</Button></b>
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
            {creatorName}
          </small>
        </Card.Footer>
      </Card>
    </Col>
  );
}

export default AdItem;

AdItem.defaultProps = {
  ad: PropTypes.shape({
    id: 0,
    creatorId: 0,
    title: '',
    topics: '',
    text: '',
    reward: 0,
  }),
};
AdItem.propTypes = {
  ad: PropTypes.shape({
    id: PropTypes.number.isRequired,
    creatorName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    topics: PropTypes.string,
    text: PropTypes.number.isRequired,
    reward: PropTypes.number,
  }),
};
