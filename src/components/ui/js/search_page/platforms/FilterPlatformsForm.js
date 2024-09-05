import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form, InputGroup, Button, Row, Col, Stack, FloatingLabel, FormGroup, FormCheck,
} from 'react-bootstrap';

function FilterPlatformsForm(props) {
  const {
    sortOrder, sortOption, setQuery, setSortOrder, setSortOption,
  } = props;
  const [isScreenSmall, setSmallScreen] = useState(window.innerWidth < 1024);
  const [owner, setOwner] = useState('');
  const [impressions, setImpressions] = useState('');
  const [topics, setTopics] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const handleWindowResize = () => {
      setSmallScreen(window.innerWidth < 1024);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleWindowResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  function applyFilters() {
    let query = '';

    if (owner.trim() !== '') {
      query += `&ownerName=${owner}`;
    }
    if (impressions.toString().trim() !== '') {
      query += `&impressions=${impressions}`;
    }
    if (topics.trim() !== '') {
      query += `&topics=${topics}`;
    }
    if (price.toString().trim() !== '') {
      query += `&preferredPrice=${price}`;
    }
    if (sortOption !== 'default') {
      query += `&sortBy=${sortOption}&sortOrder=${sortOrder}`;
    }

    setQuery(query);
  }

  function clearFilters() {
    setOwner('');
    setImpressions('');
    setTopics('');
    setPrice('');
    setSortOption('default');
    setSortOrder('asc');

    setQuery('');
  }

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  useEffect(() => {
    applyFilters();
  }, [sortOption, sortOrder]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyFilters();
    }
  };

  function isValidNumbericInput(input) {
    const value = +input; // convert to number
    if (value !== +value || value < 0) { // if fails validity check
      return false;
    }

    return true;
  }

  return (
    <div>
      <Form>
        {' '}
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
              onClick={handleSortOptionChange}
            />
            <FormCheck
              inline
              label="Platform Name"
              type="radio"
              name="sortRadio"
              id="name"
              value="platformName"
              checked={sortOption === 'platformName'}
              onClick={handleSortOptionChange}
            />
            <FormCheck
              inline
              label="Impressions"
              type="radio"
              name="sortRadio"
              id="impressions"
              value="impressions"
              checked={sortOption === 'impressions'}
              onClick={handleSortOptionChange}
            />
            <FormCheck
              inline
              label="Price"
              type="radio"
              name="sortRadio"
              id="price"
              value="preferredPrice"
              checked={sortOption === 'preferredPrice'}
              onClick={handleSortOptionChange}
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
              name="sortRadio"
              id="asc"
              value="asc"
              checked={sortOrder === 'asc'}
              onClick={handleSortOrderChange}
            />
            <FormCheck
              inline
              label="Descending"
              type="radio"
              name="sortRadio"
              id="desc"
              value="desc"
              checked={sortOrder === 'desc'}
              onClick={handleSortOrderChange}
            />
          </div>
        </FormGroup>
        {/* Add your sorting logic and display sorted data here */}
      </Form>
      <Form>

        {isScreenSmall && (
        <Row>
          <Row>
            <Col>
              <Form.Label htmlFor="owner" style={{ whiteSpace: 'nowrap' }}>Owned by</Form.Label>
              <Form.Control name="owner" type="text" placeholder="username" value={owner} onChange={(e) => setOwner(e.target.value)} />
            </Col>
            <Col>
              <Form.Label htmlFor="topics">Topics</Form.Label>
              <Form.Control name="topics" type="text" placeholder="cats, dogs" value={topics} onChange={(e) => setTopics(e.target.value)} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label htmlFor="impressions" style={{ whiteSpace: 'nowrap' }}>Min Impressions</Form.Label>
              <Form.Control name="impressions" type="text" pattern="[0-9]*" placeholder="50,000" value={impressions} onChange={(e) => (isValidNumbericInput(e.target.value) ? setImpressions(e.target.value) : null)} />
            </Col>

            <Col>
              <Form.Label htmlFor="maxPrice" style={{ whiteSpace: 'nowrap' }}>Max price</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                <Form.Control name="maxPrice" type="text" pattern="[0-9]*" value={price} onChange={(e) => (isValidNumbericInput(e.target.value) ? setPrice(e.target.value) : null)} />
              </InputGroup>
            </Col>
          </Row>
          <Col className="mb-3" style={{ alignSelf: 'flex-end' }}>
            <Stack gap={2} style={{ float: 'right' }}>
              <Button variant="primary" onClick={() => applyFilters()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                </svg>
              </Button>
              <Button variant="danger" onClick={() => clearFilters()}>
                Clear All Filters
              </Button>
            </Stack>
          </Col>
        </Row>
        )}
        {!isScreenSmall && (
        <Row>
          <Col>
            <FloatingLabel htmlFor="owner" controlId="floatingInput" label="Owner">

              <Form.Control name="owner" type="text" placeholder="username" value={owner} onKeyDown={handleKeyDown} onChange={(e) => setOwner(e.target.value)} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel htmlFor="impressions" controlId="floatingInput" label="Min Impressions">
              <Form.Control name="impressions" type="text" pattern="[0-9]*" placeholder="" onKeyDown={handleKeyDown} value={impressions} onChange={(e) => (isValidNumbericInput(e.target.value) ? setImpressions(e.target.value) : null)} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel htmlFor="topics" controlId="floatingInput" label="Topics">
              <Form.Control name="topics" type="text" placeholder="cats, dogs" value={topics} onKeyDown={handleKeyDown} onChange={(e) => setTopics(e.target.value)} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel htmlFor="maxPrice" controlId="floatingInput" label="Max price">
              <Form.Control name="maxPrice" type="text" pattern="[0-9]*" placeholder="" value={price} onKeyDown={handleKeyDown} onChange={(e) => (isValidNumbericInput(e.target.value) ? setPrice(e.target.value) : null)} />
            </FloatingLabel>
          </Col>
          <Col className="mb-3" style={{ alignSelf: 'flex-end' }}>
            <Stack gap={2} style={{ float: 'right' }}>
              <Button variant="danger" onClick={() => clearFilters()}>
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

export default FilterPlatformsForm;

FilterPlatformsForm.defaultProps = {
  sortOption: 'default',
  sortOrder: 'asc',
  setQuery: () => { },
  setSortOption: () => { },
  setSortOrder: () => { },
};
FilterPlatformsForm.propTypes = {
  sortOption: PropTypes.string,
  sortOrder: PropTypes.string,
  setQuery: PropTypes.func,
  setSortOption: PropTypes.func,
  setSortOrder: PropTypes.func,
};
