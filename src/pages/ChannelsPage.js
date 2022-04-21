/* eslint-disable react/jsx-one-expression-per-line */
// Should probably enable later, for now it is just useless
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

function ChannelItem(props) {
  const { channel } = props;
  const {
    id, ownerName, channelName, subscribers, topics, preferredReward,
  } = channel;
  const navigate = useNavigate();

  function makeOffer() {
    navigate('/new_offer', { state: id });
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
ChannelItem.defaultProps = {
  channel: PropTypes.shape({
    id: 0,
    ownerName: '',
    channelName: '',
    subscribers: 0,
    topics: '',
    preferredReward: 0,
  }),
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
};

function ListOfChannels(props) {
  const { query } = props;
  const [channels, setChannels] = useState(Array(0));

  function getChannels(newQuery) {
    // fetch channels from database
    fetch(`/return_channels?for=channelsPage${newQuery}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setChannels(data.channelsData);
        } else {
          throw new Error('Error while fetching channels data');
        }
      });
  }

  useEffect(() => { getChannels(query); }, [props]);
  if (channels.length === 0) {
    return (
      <h2 className="text-muted" align="center">
        No channels are found. Try different filters?
      </h2>
    );
  }
  const listOfChannels = channels.map((channel) => <ChannelItem channel={channel} />);
  return (
    <Row xs={1} md={2} className="g-4">
      {listOfChannels}
    </Row>
  );
}
ListOfChannels.defaultProps = {
  query: '',
};
ListOfChannels.propTypes = {
  query: PropTypes.string,
};

function SearchBar(props) {
  const { setQuery } = props;
  const [id, setID] = useState('');
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');
  const [subs, setSubs] = useState('');
  const [topics, setTopics] = useState('');
  const [reward, setReward] = useState('');

  function applyFilters() {
    let query = '';
    if (id.toString().trim() !== '') {
      query += `&id=${id}`;
    }
    if (owner.trim() !== '') {
      query += `&owner=${owner}`;
    }
    if (name.trim() !== '') {
      query += `&name=${name}`;
    }
    if (subs.toString().trim() !== '') {
      query += `&subs=${subs}`;
    }
    if (topics.trim() !== '') {
      query += `&topics=${topics}`;
    }
    if (reward.toString().trim() !== '') {
      query += `&reward=${reward}`;
    }

    setQuery(query);
  }

  function clearFilters() {
    setID('');
    setOwner('');
    setName('');
    setSubs('');
    setTopics('');
    setReward('');

    setQuery('');
  }

  function isValidNumbericInput(input) {
    const value = +input; // convert to number
    if (value !== +value || value < 0) { // if fails validity check
      return false;
    }

    return true;
  }

  return (
    <Form>
      <p><b>Filter by:</b></p>
      <Form.Label htmlFor="id">Channel`s #</Form.Label>
      <Form.Control name="id" type="text" pattern="[0-9]*" placeholder="100, 101" value={id} onChange={(e) => (isValidNumbericInput(e.target.value) ? setID(e.target.value) : null)} />

      <Form.Label htmlFor="owner">Owned by</Form.Label>
      <Form.Control name="owner" type="text" placeholder="username" value={owner} onChange={(e) => setOwner(e.target.value)} />

      <Form.Label htmlFor="name">Name</Form.Label>
      <Form.Control name="name" type="title" value={name} onChange={(e) => setName(e.target.value)} />

      <Form.Label htmlFor="subs">Min subscribers</Form.Label>
      <Form.Control name="subs" type="text" pattern="[0-9]*" placeholder="" value={subs} onChange={(e) => (isValidNumbericInput(e.target.value) ? setSubs(e.target.value) : null)} />

      <Form.Label htmlFor="topics">Topics</Form.Label>
      <Form.Control name="topics" type="text" placeholder="cats, dogs" value={topics} onChange={(e) => setTopics(e.target.value)} />

      <Form.Label htmlFor="maxReward">Max reward</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
        <Form.Control name="maxReward" type="text" pattern="[0-9]*" value={reward} onChange={(e) => (isValidNumbericInput(e.target.value) ? setReward(e.target.value) : null)} />
      </InputGroup>

      <div className="d-grid gap-2">
        <Button variant="primary" onClick={() => applyFilters()}>Apply filters</Button>
        <Button variant="danger" onClick={() => clearFilters()}>Clear all filters</Button>
      </div>
    </Form>
  );
}
SearchBar.defaultProps = {
  setQuery: () => { },
};
SearchBar.propTypes = {
  setQuery: PropTypes.func,
};

function ChannelsPage() {
  const [query, setQuery] = useState('');
  return (
    <div>
      <br />
      <Container>
        <Row>
          <Col xs={2}>
            <div className="position-sticky">
              <SearchBar setQuery={(newQuery) => setQuery(newQuery)} />
            </div>
          </Col>
          <Col>
            <ListOfChannels query={query} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ChannelsPage;
