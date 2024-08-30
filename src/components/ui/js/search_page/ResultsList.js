/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Spinner, Col, Collapse, Row, OverlayTrigger, Button, Tooltip,
} from 'react-bootstrap';

import PropTypes from 'prop-types';
import ListComponent from './ListComponent';
import FilterPlatformsForm from './platforms/FilterPlatformsForm';
import FilterCampaignsForm from './ads/FilterCampaignsForm';
import FilterUsersForm from './users/FilterUsersForm';

function ResultsList({ resultType }) {
  const [query, setQuery] = useState('');

  const [open, setOpen] = useState(false);
  const [platforms, setPlatforms] = useState(Array(0));
  // eslint-disable-next-line no-unused-vars
  const [campaigns, setCampaigns] = useState(Array(0));
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState(Array(0));
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [queryResultsCount, setQueryResultsCount] = useState(1);
  const [isResultFound, setIsResultsFound] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortOption, setSortOption] = useState('default');

  function areResultsFound(data) {
    let resultFound = true;
    if (data === null) {
      resultFound = false;
    } else if (data.total_results === 0) {
      resultFound = false;
    }

    setIsResultsFound(resultFound);
  }

  function processData(data) {
    // eslint-disable-next-line default-case
    switch (resultType) {
      case 'platforms':
        setPlatforms(data.platformsData);
        break;
      case 'campaigns':
        setCampaigns(data.campaignsData);
        break;
      case 'users':
        setUsers(data.accountsData);
        break;
    }
    setQueryResultsCount(data.total_results);
    setItemsPerPage(20);
  }

  function getResults(newQuery, page, perPage) {
    // fetch platforms from database with pagination parameters
    setLoading(true);

    fetch(`/return_results?for=${resultType + newQuery}&page=${page}&perPage=${perPage}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          processData(data);
          areResultsFound(data);
        } else {
          throw new Error('Error while fetching platforms data');
        }
      }).finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getResults(query, currentPage, itemsPerPage);
  }, [query, currentPage, resultType]);

  const renderTooltip = ({
    id, content, placement, delay,
  }) => (
    <Tooltip id={id} placement={placement} delay={delay}>
      {content}
    </Tooltip>
  );

  return (
    <div>
      <Row>
        <Collapse in={open}>
          <Row>

            {resultType === 'platforms' && (
            <FilterPlatformsForm
              sortOption={sortOption}
              sortOrder={sortOrder}
              setQuery={
                (newQuery) => setQuery(newQuery)
              }
              setSortOption={
                (newSortOption) => setSortOption(newSortOption)
              }
              setSortOrder={
                (newSortOrder) => setSortOrder(newSortOrder)
              }
            />
            )}
            {resultType === 'campaigns' && (
            <FilterCampaignsForm
              sortOption={sortOption}
              sortOrder={sortOrder}
              setQuery={
                (newQuery) => setQuery(newQuery)
              }
              setSortOption={
                (newSortOption) => setSortOption(newSortOption)
              }
              setSortOrder={
                (newSortOrder) => setSortOrder(newSortOrder)
              }
            />
            )}
            {resultType === 'users' && (
              <FilterUsersForm
                sortOption={sortOption}
                sortOrder={sortOrder}
                setQuery={
                  (newQuery) => setQuery(newQuery)
                }
                setSortOption={
                  (newSortOption) => setSortOption(newSortOption)
                }
                setSortOrder={
                  (newSortOrder) => setSortOrder(newSortOrder)
                }
              />
            )}

          </Row>
        </Collapse>
        <Col>
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip({
              id: 'filter-button',
              content: (open
              ) ? 'Hide Advanced Filters' : 'Advanced Filters',
              placement: 'top', // Specify the placement if needed
              delay: { show: 250, hide: 400 },
            })}
          >
            <Button variant="secondary" onClick={() => setOpen(!open)} className="mr-5 mt-1" aria-controls="advance-filter" aria-expanded={open} aria-label="Advanced Filters" style={{ width: 'auto', float: 'right' }}>
              {!open && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filter" viewBox="0 0 16 16">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
              </svg>
              )}
              {open && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-up" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5m-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5" />
              </svg>
              )}
            </Button>
          </OverlayTrigger>

        </Col>
      </Row>

      {loading ? (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
        >

          <Spinner animation="border" role="status" variant="secondary" />
        </div>
      ) : (
        !isResultFound ? (
          <h2 className="text-muted" align="center">
            No
            {' '}
            {resultType}
            {' '}
            are found. Try a different filter?
          </h2>
        ) : (
          <Col>
            {resultType === 'platforms'
            && (
            <Col>

              <ListComponent
                results={platforms}
                resultsType={resultType}
                queryResultsCount={queryResultsCount}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Col>
            )}
            {resultType === 'campaigns'
                  && (
                    <Col>

                      <ListComponent
                        results={campaigns}
                        resultsType={resultType}
                        queryResultsCount={queryResultsCount}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </Col>
                  )}
            {resultType === 'users'
                  && (
                    <Col>

                      <ListComponent
                        results={users}
                        resultsType={resultType}
                        queryResultsCount={queryResultsCount}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </Col>
                  )}

          </Col>
        )
      )}
    </div>
  );
}

export default ResultsList;

ResultsList.propTypes = {
  resultType: PropTypes.string.isRequired,
};
