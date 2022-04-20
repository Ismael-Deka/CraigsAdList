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

function AdItem(props) {
  const { ad } = props;
  const {
    id, creatorName, title, topics, text, reward,
  } = ad;
  const navigate = useNavigate();

  function makeResponse() {
    navigate('/new_response', { state: id });
  }

  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title><u>{title}</u></Card.Title>
          <Card.Text>
            <p>
              Topics:
              <br />
              {topics}
            </p>

            <p>Text:
              <br />
              {text}
            </p>

            <p>
              <b style={{ float: 'left' }}>Reward: ${reward}</b>
              <b style={{ float: 'right' }}><Button variant="primary" onClick={() => makeResponse()}>Respond</Button></b>
            </p>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted" style={{ float: 'left' }}>
            #{id}
          </small>
          <small className="text-muted" style={{ float: 'right' }}>
            by {creatorName}
          </small>
        </Card.Footer>
      </Card>
    </Col>
  );
}
AdItem.defaultProps = {
  ad: PropTypes.shape({
    id: 0,
    creatorId: 0,
    title: '',
    topics: '',
    text: '',
    reward: 0,
    showInList: true,
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
    showInList: PropTypes.bool.isRequired,
  }),
};

function ListOfAds(props) {
  const { query } = props;
  const [ads, setAds] = useState(Array(0));

  function getAds(newQuery) {
    // eslint-disable-next-line no-console
    console.log(`Path for ads fetching: /return_ads?for=adsPage${query}`);
    // fetch ads from database
    fetch(`/return_ads?for=adsPage${newQuery}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAds(data.adsData);
          // eslint-disable-next-line no-console
          console.log(data);
        } else {
          throw new Error('Error while fetching ads data');
        }
      });
  }

  useEffect(() => { getAds(query); }, [props]);
  if (ads.length === 0) {
    return (
      <h2 className="text-muted" align="center">
        No ads are found. Try different filters?
      </h2>
    );
  }
  const listOfAds = ads.map((ad) => <AdItem ad={ad} />);
  return (
    <Row xs={1} md={2} className="g-4">
      {listOfAds}
    </Row>
  );
}
ListOfAds.defaultProps = {
  query: '',
};
ListOfAds.propTypes = {
  query: PropTypes.string,
};

function SearchBar(props) {
  const { setQuery } = props;
  const [id, setID] = useState('');
  const [creator, setCreator] = useState('');
  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState('');
  const [text, setText] = useState('');
  const [reward, setReward] = useState('');

  function applyFilters() {
    let query = '';
    if (id.toString().trim() !== '') {
      query += `&id=${id}`;
    }
    if (creator.trim() !== '') {
      query += `&creator=${creator}`;
    }
    if (title.trim() !== '') {
      query += `&title=${title}`;
    }
    if (topics.trim() !== '') {
      query += `&topics=${topics}`;
    }
    if (text.trim() !== '') {
      query += `&text=${text}`;
    }
    if (reward.toString().trim() !== '') {
      query += `&reward=${reward}`;
    }

    // eslint-disable-next-line no-console
    console.log(`Query params: ${query}`);
    setQuery(query);
  }

  function clearFilters() {
    setID('');
    setCreator('');
    setTitle('');
    setTopics('');
    setText('');
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
      <Form.Label htmlFor="id">Ad`s #</Form.Label>
      <Form.Control name="id" type="text" pattern="[0-9]*" placeholder="100, 101" value={id} onChange={(e) => (isValidNumbericInput(e.target.value) ? setID(e.target.value) : null)} />

      <Form.Label htmlFor="creator">Posted by</Form.Label>
      <Form.Control name="creator" type="text" placeholder="username" value={creator} onChange={(e) => setCreator(e.target.value)} />

      <Form.Label htmlFor="title">Title</Form.Label>
      <Form.Control name="title" type="title" value={title} onChange={(e) => setTitle(e.target.value)} />

      <Form.Label htmlFor="topics">Topics</Form.Label>
      <Form.Control name="topics" type="text" placeholder="cats, dogs" value={topics} onChange={(e) => setTopics(e.target.value)} />

      <Form.Label htmlFor="text">Text</Form.Label>
      <Form.Control name="text" type="text" value={text} onChange={(e) => setText(e.target.value)} />

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

function AdsPage() {
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
            <ListOfAds query={query} />
          </Col>
        </Row>
      </Container>
    </div>

  );
}

export default AdsPage;
