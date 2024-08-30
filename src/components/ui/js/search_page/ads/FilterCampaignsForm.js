import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form, InputGroup, Button, Row, Col, Stack, FloatingLabel, FormGroup, FormCheck,
} from 'react-bootstrap';

function FilterCampaignsForm(props) {
  const {
    sortOrder, sortOption, setQuery, setSortOrder, setSortOption,
  } = props;
  const [isScreenSmall, setSmallScreen] = useState(window.innerWidth < 1024);
  const [ownerName, setOwnerName] = useState('');
  const [topics, setTopics] = useState('');
  const [preferredReward, setPreferredReward] = useState('');

  useEffect(() => {
    const handleWindowResize = () => {
      setSmallScreen(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  const applyFilters = () => {
    let query = '';

    if (ownerName.trim() !== '') {
      query += `&ownerName=${ownerName}`;
    }
    if (topics.trim() !== '') {
      query += `&topics=${topics}`;
    }
    if (preferredReward.toString().trim() !== '') {
      query += `&preferredReward=${preferredReward}`;
    }
    if (sortOption !== 'default') {
      query += `&sortBy=${sortOption}&sortOrder=${sortOrder}`;
    }

    setQuery(query);
  };

  useEffect(() => {
    applyFilters();
  }, [sortOption, sortOrder]);

  const clearFilters = () => {
    setOwnerName('');
    setTopics('');
    setPreferredReward('');
    setSortOption('default');
    setSortOrder('asc');

    setQuery('');
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyFilters();
    }
  };

  function isValidNumericInput(input) {
    const value = +input; // convert to number
    if (value !== +value || value < 0) { // if fails validity check
      return false;
    }

    return true;
  }

  return (
    <div>
      <Form>
        <FormGroup className="mb-3">
          <Form.Label>Sort by:</Form.Label>
          <div>
            <FormCheck
              inline
              label="Default"
              type="radio"
              name="sortRadio"
              id="default"
              value="default"
              checked={sortOption === 'default'}
              onChange={handleSortOptionChange}
            />
            <FormCheck
              inline
              label="Owner Name"
              type="radio"
              name="sortRadio"
              id="ownerName"
              value="ownerName"
              checked={sortOption === 'ownerName'}
              onChange={handleSortOptionChange}
            />
            <FormCheck
              inline
              label="Topics"
              type="radio"
              name="sortRadio"
              id="topics"
              value="topics"
              checked={sortOption === 'topics'}
              onChange={handleSortOptionChange}
            />
            <FormCheck
              inline
              label="Preferred Reward"
              type="radio"
              name="sortRadio"
              id="preferredReward"
              value="preferredReward"
              checked={sortOption === 'preferredReward'}
              onChange={handleSortOptionChange}
            />
          </div>
        </FormGroup>
      </Form>
      <Form>
        <FormGroup className="mb-3">
          <Form.Label>Sort Order:</Form.Label>
          <div>
            <FormCheck
              inline
              label="Ascending"
              type="radio"
              name="sortOrderRadio"
              id="asc"
              value="asc"
              checked={sortOrder === 'asc'}
              onChange={handleSortOrderChange}
            />
            <FormCheck
              inline
              label="Descending"
              type="radio"
              name="sortOrderRadio"
              id="desc"
              value="desc"
              checked={sortOrder === 'desc'}
              onChange={handleSortOrderChange}
            />
          </div>
        </FormGroup>
      </Form>
      <Form>
        {isScreenSmall ? (
          <Row>
            <Row>
              <Col>
                <Form.Label htmlFor="ownerName" style={{ whiteSpace: 'nowrap' }}>Owned by</Form.Label>
                <Form.Control name="ownerName" type="text" placeholder="username" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              </Col>
              <Col>
                <Form.Label htmlFor="topics">Topics</Form.Label>
                <Form.Control name="topics" type="text" placeholder="cats, dogs" value={topics} onChange={(e) => setTopics(e.target.value)} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label htmlFor="preferredReward" style={{ whiteSpace: 'nowrap' }}>Max Reward</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                  <Form.Control name="preferredReward" type="text" pattern="[0-9]*" value={preferredReward} onChange={(e) => (isValidNumericInput(e.target.value) ? setPreferredReward(e.target.value) : null)} />
                </InputGroup>
              </Col>
            </Row>
            <Col className="mb-3" style={{ alignSelf: 'flex-end' }}>
              <Stack gap={2} style={{ float: 'right' }}>
                <Button variant="primary" onClick={applyFilters}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                  </svg>
                </Button>
                <Button variant="danger" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </Stack>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <FloatingLabel htmlFor="ownerName" controlId="floatingInput" label="Owner Name">
                <Form.Control name="ownerName" type="text" placeholder="username" value={ownerName} onKeyDown={handleKeyDown} onChange={(e) => setOwnerName(e.target.value)} />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel htmlFor="topics" controlId="floatingInput" label="Topics">
                <Form.Control name="topics" type="text" placeholder="cats, dogs" value={topics} onKeyDown={handleKeyDown} onChange={(e) => setTopics(e.target.value)} />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel htmlFor="preferredReward" controlId="floatingInput" label="Max Reward">
                <Form.Control name="preferredReward" type="text" pattern="[0-9]*" placeholder="" value={preferredReward} onKeyDown={handleKeyDown} onChange={(e) => (isValidNumericInput(e.target.value) ? setPreferredReward(e.target.value) : null)} />
              </FloatingLabel>
            </Col>
            <Col className="mb-3" style={{ alignSelf: 'flex-end' }}>
              <Stack gap={2} style={{ float: 'right' }}>
                <Button variant="danger" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </Stack>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
}

export default FilterCampaignsForm;

FilterCampaignsForm.defaultProps = {
  sortOption: 'default',
  sortOrder: 'asc',
  setQuery: () => { },
  setSortOption: () => { },
  setSortOrder: () => { },
};

FilterCampaignsForm.propTypes = {
  sortOption: PropTypes.string,
  sortOrder: PropTypes.string,
  setQuery: PropTypes.func,
  setSortOption: PropTypes.func,
  setSortOrder: PropTypes.func,
};
