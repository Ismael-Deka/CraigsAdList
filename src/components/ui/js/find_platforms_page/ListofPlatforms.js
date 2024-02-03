/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Row, Spinner, Pagination, Col, Button, OverlayTrigger, Tooltip, Collapse,
} from 'react-bootstrap';

import PlatformItem from './PlatformItem';
import FilterSearchForm from './FilterSearchForm';

function ListOfPlatforms() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [platforms, setPlatforms] = useState(Array(0));
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [queryResultsCount, setQueryResultsCount] = useState(1);

  function getPlatforms(newQuery, page, perPage) {
    // fetch platforms from database with pagination parameters
    setLoading(true);
    fetch(`/return_channels?for=platformsPage${newQuery}&page=${page}&perPage=${perPage}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPlatforms(data.platformsData);
          setQueryResultsCount(data.total_results);
          setItemsPerPage(20);
        } else {
          throw new Error('Error while fetching platforms data');
        }
      }).finally(() => {
        setLoading(false);
      }, [queryResultsCount]);
  }

  const renderTooltip = ({
    id, content, placement, delay,
  }) => (
    <Tooltip id={id} placement={placement} delay={delay}>
      {content}
    </Tooltip>
  );

  useEffect(() => {
    getPlatforms(query, currentPage, itemsPerPage);
  }, [query, currentPage]);
  return (
    <div>
      {loading ? (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
        >
          <Spinner animation="border" role="status" variant="secondary" />
        </div>
      ) : (
        (platforms !== null && (platforms.length === 0 || platforms === null)) ? (
          <h2 className="text-muted" align="center">
            No platforms are found. Try different filters?
          </h2>
        ) : (
          <Col>
            <h3>
              {queryResultsCount}
              {' '}
              results found.
            </h3>
            <Col>
              <Row>
                <Collapse in={open}>
                  <Row>
                    <FilterSearchForm setQuery={
                          (newQuery) => setQuery(newQuery)
                        }
                    />
                  </Row>
                </Collapse>
              </Row>
              <Row>
                <Col>
                  <Pagination variant="secondary" className="mb-5">
                    {
                          Array.from({
                            length: Math.floor(queryResultsCount / itemsPerPage),
                          }).map((_, index) => {
                            if ((index < 2)
                              || (index > currentPage - 3 && index < currentPage + 2)
                              || (index > Math.floor(queryResultsCount / itemsPerPage) - 3)
                            ) {
                              return (
                                <Pagination.Item
                                  key={`page-${index + 1}`}
                                  active={index + 1 === currentPage}
                                  onClick={() => setCurrentPage(index + 1)}
                                >
                                  {index + 1}
                                </Pagination.Item>
                              );
                            } if (
                              (index === 2 && currentPage > 5)
                              || (index === Math.floor(queryResultsCount / itemsPerPage) - 3
                                && currentPage < Math.floor(queryResultsCount / itemsPerPage) - 5)
                            ) {
                              // Show an ellipsis item
                              return (
                                <>
                                  <Pagination.Ellipsis key={`ellipsis-${index + 1}`} />
                                  <Pagination.Item
                                    key={`page-${Math.floor(queryResultsCount / itemsPerPage)}`}
                                    onClick={() => setCurrentPage(
                                      Math.floor(queryResultsCount / itemsPerPage),
                                    )}
                                  >
                                    {Math.floor(queryResultsCount / itemsPerPage)}
                                  </Pagination.Item>
                                </>
                              );
                            }

                            return null; // Hide other pages
                          })
                        }
                  </Pagination>
                </Col>
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
                    <Button variant="secondary" onClick={() => setOpen(!open)} className="mr-5" aria-controls="advance-filter" aria-expanded={open} aria-label="Advanced Filters" style={{ width: 'auto', float: 'right' }}>
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
            </Col>

            <Row lg={1} xl={2} className="g-4">
              {
        platforms.map(
          (platform) => (
            <PlatformItem
              platform={platform}
            />
          ),
        )
      }
            </Row>
            <Row>
              <Pagination className="mt-5">
                {
                    Array.from({
                      length: Math.floor(queryResultsCount / itemsPerPage),
                    }).map((_, index) => {
                      if ((index < 2)
                        || (index > currentPage - 3 && index < currentPage + 2)
                        || (index > Math.floor(queryResultsCount / itemsPerPage) - 3)
                      ) {
                        return (
                          <Pagination.Item
                            key={`page-${index + 1}`}
                            active={index + 1 === currentPage}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        );
                      } if (
                        (index === 2 && currentPage > 5)
                        || (index === Math.floor(queryResultsCount / itemsPerPage) - 3
                          && currentPage < Math.floor(queryResultsCount / itemsPerPage) - 5)
                      ) {
                        // Show an ellipsis item
                        return (
                          <>
                            <Pagination.Ellipsis key={`ellipsis-${index + 1}`} />
                            <Pagination.Item
                              key={`page-${Math.floor(queryResultsCount / itemsPerPage)}`}
                              onClick={() => setCurrentPage(
                                Math.floor(queryResultsCount / itemsPerPage),
                              )}
                            >
                              {Math.floor(queryResultsCount / itemsPerPage)}
                            </Pagination.Item>
                          </>
                        );
                      }

                      return null; // Hide other pages
                    })
                  }
              </Pagination>
            </Row>
          </Col>
        )
      )}
    </div>
  );
}

export default ListOfPlatforms;
