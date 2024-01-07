import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import AdItem from './AdItem';

function ListOfAds(props) {
  const { query } = props;
  const [ads, setAds] = useState(Array(0));

  function getAds(newQuery) {
    // fetch ads from database
    fetch(`/return_ads?for=adsPage${newQuery}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAds(data.adsData);
        } else {
          throw new Error('Error while fetching ads data');
        }
      });
  }

  useEffect(() => { getAds(query); }, [props]);
  if (ads.length === 0) {
    return (
      <h2 className="text-muted" align="center">
        No ads are found. Try different filters?
      </h2>
    );
  }
  const listOfAds = ads.map((ad) => <AdItem ad={ad} />);
  return (
    <Row xs={1} md={2} className="g-4">
      {listOfAds}
    </Row>
  );
}

export default ListOfAds;

ListOfAds.defaultProps = {
  query: '',
};
ListOfAds.propTypes = {
  query: PropTypes.string,
};
