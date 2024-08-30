import {
  Col, Row, Pagination,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import PlatformItem from './platforms/PlatformItem';
import AdCampaignItem from './ads/AdCampaignItem';
import UserItem from './users/UserItem';

function ListComponent({
  queryResultsCount, results, resultsType, itemsPerPage, setCurrentPage, currentPage,
}) {
  const getPlatformItem = (platform) => (
    <PlatformItem
      platform={platform}
    />
  );
  const getCampaignItem = (campaign) => (
    <AdCampaignItem
      campaign={campaign}
    />
  );
  const getUserItem = (user) => (
    <UserItem
      user={user}
    />
  );

  const handleResultItems = (resultItem) => {
    switch (resultsType) {
      case 'platforms':
        return getPlatformItem(resultItem);
      case 'campaigns':
        return getCampaignItem(resultItem);
      case 'users':
        return getUserItem(resultItem);
      default:
        return (<div />);
    }
  };

  return (
    <div>
      <Col>

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
                                      onClick={() => {
                                        setCurrentPage(index + 1);
                                      }}
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

        </Row>
      </Col>
      <Col>
        <h3>
          {queryResultsCount}
          {' '}
          results found.
        </h3>

        <Row lg={1} xl={2} className="g-4">
          {

                        results.map(
                          (resultsItem) => (
                            handleResultItems(resultsItem)
                          ),
                        )

                            }
        </Row>
      </Col>
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

    </div>
  );
}

export default ListComponent;

ListComponent.propTypes = {
  setCurrentPage: PropTypes.func.isRequired,
  resultsType: PropTypes.string.isRequired,
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  queryResultsCount: PropTypes.number,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      ownerId: PropTypes.number.isRequired,
      ownerName: PropTypes.string.isRequired,
      platformName: PropTypes.string.isRequired,
      subscribers: PropTypes.number.isRequired,
      topics: PropTypes.string,
      preferredReward: PropTypes.number,
    }),
  ),
};

ListComponent.defaultProps = {
  itemsPerPage: 20,
  currentPage: 1,
  queryResultsCount: 0,
  results: [],
};
