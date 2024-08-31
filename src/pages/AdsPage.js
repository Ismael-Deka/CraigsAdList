import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ListOfAds from '../components/ui/js/misc/ListofAds';

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
