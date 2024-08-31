import { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Import useNavigate (React Router v5) or useNavigate (React Router v6)
import {
  Form, InputGroup, FormControl, Button, ListGroup, FormCheck,
} from 'react-bootstrap';
import classes from '../../css/SearchField.module.css';

function SearchField() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword');

  const [state, setState] = useState({
    query: (keyword !== null) ? keyword : '',
    searchType: 'Platforms', // Track the selected search type
    isSearchFocused: false, // Track if the search field is focused
    isDropdownFocused: false,
  });

  const navigate = useNavigate(); // Initialize useNavigate (or useNavigate for React Router v6+)
  const searchInputRef = useRef(null); // Ref to track the search input element

  const dropdownStyle = {
    width: searchInputRef.current ? `${searchInputRef.current.offsetWidth}px` : 'auto',
  };

  const handleSearchFocus = useCallback(() => {
    setState((prevState) => ({ ...prevState, isSearchFocused: true }));
  }, []);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => {
      setState((prevState) => ({ ...prevState, isSearchFocused: false }));
    }, 100);
  }, []);

  const handleDropdownFocus = useCallback(() => {
    setState((prevState) => ({ ...prevState, isDropdownFocused: true }));
  }, []);

  const handleDropdownBlur = useCallback(() => {
    setTimeout(() => {
      setState((prevState) => ({ ...prevState, isDropdownFocused: false }));
    }, 100);
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && state.query.trim() !== '') {
      const searchOption = state.searchType.toLowerCase();
      navigate(`/search/${searchOption}?keyword=${state.query}`);
      event.preventDefault();
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  };

  return (
    <Form inline className="my-2 my-lg-0 mx-auto mr-4" onSubmit={handleFormSubmit}>
      <InputGroup>
        <FormControl
          type="text"
          placeholder="Search"
          style={{ width: '30vw' }}
          className={`${classes.searchBar} mr-sm-2`}
          value={state.query}
          onChange={(e) => {
            const query = e.target.value;
            setState((prevState) => ({ ...prevState, query }));
          }}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onKeyPress={handleKeyPress} // Add onKeyPress handler
          ref={searchInputRef}
        />
        <Button
          variant="outline-light"
          className={classes.search_bar_clear}
          onClick={() => setState((prevState) => ({ ...prevState, query: '', searchResults: [] }))}
        >
          X
        </Button>
      </InputGroup>
      {(state.isSearchFocused || state.isDropdownFocused) && (
        <ListGroup
          onFocus={handleDropdownFocus}
          onBlur={handleDropdownBlur}
          className="position-absolute mt-1"
          style={{ zIndex: 1000, ...dropdownStyle }}
        >
          <ListGroup.Item>
            <FormCheck
              type="radio"
              name="searchType"
              id="platforms"
              label="Platforms"
              checked={state.searchType === 'Platforms'}
              onChange={() => setState((prevState) => ({ ...prevState, searchType: 'Platforms' }))}
            />
          </ListGroup.Item>
          <ListGroup.Item>
            <FormCheck
              type="radio"
              name="searchType"
              id="campaigns"
              label="Ad Campaigns"
              checked={state.searchType === 'Campaigns'}
              onChange={() => setState((prevState) => ({ ...prevState, searchType: 'Campaigns' }))}
            />
          </ListGroup.Item>
          <ListGroup.Item>
            <FormCheck
              type="radio"
              name="searchType"
              id="users"
              label="Users"
              checked={state.searchType === 'Users'}
              onChange={() => setState((prevState) => ({ ...prevState, searchType: 'Users' }))}
            />
          </ListGroup.Item>
        </ListGroup>
      )}
    </Form>
  );
}

export default SearchField;
