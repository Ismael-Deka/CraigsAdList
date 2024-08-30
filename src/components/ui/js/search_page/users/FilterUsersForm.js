import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Stack, FormGroup, FormCheck,
} from 'react-bootstrap';

function FilterUsersForm(props) {
  const {
    sortOrder, sortOption, setQuery, setSortOrder, setSortOption,
  } = props;

  const applyFilters = () => {
    let query = '';

    if (sortOption !== 'default') {
      query += `&sortBy=${sortOption}&sortOrder=${sortOrder}`;
    }

    setQuery(query);
  };

  const clearFilters = () => {
    setSortOption('relevance');
    setSortOrder('asc');

    setQuery('');
  };

  useEffect(() => {
    applyFilters();
  }, [sortOption, sortOrder]);

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div>
      <Form>
        <FormGroup className="mb-3">
          <Form.Label>Sort by:</Form.Label>
          <div>
            <FormCheck
              inline
              label="Relevance"
              type="radio"
              name="sortRadio"
              id="relevance"
              value="relevance"
              checked={sortOption === 'relevance'}
              onChange={handleSortOptionChange}
            />
            <FormCheck
              inline
              label="Alphabetical"
              type="radio"
              name="sortRadio"
              id="alphabetical"
              value="alphabetical"
              checked={sortOption === 'alphabetical'}
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
      <Stack direction="horizontal" gap={2} className="justify-content-end">
        <Button variant="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="danger" onClick={clearFilters}>
          Clear All Filters
        </Button>
      </Stack>
    </div>
  );
}

export default FilterUsersForm;

FilterUsersForm.defaultProps = {
  sortOption: 'relevance',
  sortOrder: 'asc',
  setQuery: () => { },
  setSortOption: () => { },
  setSortOrder: () => { },
};

FilterUsersForm.propTypes = {
  sortOption: PropTypes.string,
  sortOrder: PropTypes.string,
  setQuery: PropTypes.func,
  setSortOption: PropTypes.func,
  setSortOrder: PropTypes.func,
};
