import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form, InputGroup, Button, Row, Col, Stack, FloatingLabel,
} from 'react-bootstrap';

function FilterSearchForm(props) {
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
      <Row>
        <Col>
          <FloatingLabel htmlFor="id" controlId="floatingInput" label="Platform`s #">
            <Form.Control name="id" type="text" pattern="[0-9]*" placeholder="Platform`s #" value={id} onChange={(e) => (isValidNumbericInput(e.target.value) ? setID(e.target.value) : null)} />
          </FloatingLabel>

        </Col>
        <Col>
          <Form.Label htmlFor="owner">Owned by</Form.Label>
          <Form.Control name="owner" type="text" placeholder="username" value={owner} onChange={(e) => setOwner(e.target.value)} />
        </Col>
        <Col>
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control name="name" type="title" value={name} onChange={(e) => setName(e.target.value)} />
        </Col>
        <Col>
          <Form.Label htmlFor="subs">Min subscribers</Form.Label>
          <Form.Control name="subs" type="text" pattern="[0-9]*" placeholder="" value={subs} onChange={(e) => (isValidNumbericInput(e.target.value) ? setSubs(e.target.value) : null)} />
        </Col>
        <Col>
          <Form.Label htmlFor="topics">Topics</Form.Label>
          <Form.Control name="topics" type="text" placeholder="cats, dogs" value={topics} onChange={(e) => setTopics(e.target.value)} />
        </Col>
        <Col>
          <Form.Label htmlFor="maxReward">Max reward</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
            <Form.Control name="maxReward" type="text" pattern="[0-9]*" value={reward} onChange={(e) => (isValidNumbericInput(e.target.value) ? setReward(e.target.value) : null)} />
          </InputGroup>
        </Col>
        <Col className="mb-3" style={{ alignSelf: 'flex-end' }}>
          <Stack direction="horizontal" gap={2} style={{ float: 'right' }}>
            <Button variant="primary" onClick={() => applyFilters()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
              </svg>
            </Button>
            <Button variant="danger" onClick={() => clearFilters()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </Button>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
}

export default FilterSearchForm;

FilterSearchForm.defaultProps = {
  setQuery: () => { },
};
FilterSearchForm.propTypes = {
  setQuery: PropTypes.func,
};
