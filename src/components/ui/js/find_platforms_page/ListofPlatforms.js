import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import PlatformItem from './PlatformItem';

function ListOfPlatforms(props) {
  const { query } = props;
  const [platforms, setPlatforms] = useState(Array(0));

  function getPlatforms(newQuery) {
    // fetch platforms from database
    fetch(`/return_channels?for=platformsPage${newQuery}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPlatforms(data.platformsData);
        } else {
          throw new Error('Error while fetching platforms data');
        }
      });
  }

  useEffect(() => { getPlatforms(query); }, [props]);
  if (platforms !== null) {
    if (platforms.length === 0 || platforms === null) {
      return (
        <h2 className="text-muted" align="center">
          No platforms are found. Try different filters?
        </h2>
      );
    }
  }

  const listOfPlatforms = platforms.map(
    (platform) => (
      <PlatformItem
        platform={platform}
      />
    ),
  );
  return (
    <Row xs={1} md={2} className="g-4">
      {listOfPlatforms}
    </Row>

  );
}

export default ListOfPlatforms;

ListOfPlatforms.defaultProps = {
  query: '',

};
ListOfPlatforms.propTypes = {
  query: PropTypes.string,

};
