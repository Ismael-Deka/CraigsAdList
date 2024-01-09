// PlatformListItem.js

import React from 'react';
import PropTypes from 'prop-types';

function PlatformListItem({
  platformName, subCount, topics, pricePerAdView, currency,
}) {
  return (
    <div className="platform-list-item">
      <h4>{platformName}</h4>
      <p>
        Subscribers:
        {subCount}
      </p>
      <p>
        Topics:
        {topics}
      </p>
      <p>
        Preferred Price per Ad View:
        {' '}
        {pricePerAdView}
        {' '}
        {currency}
      </p>
    </div>
  );
}

PlatformListItem.propTypes = {
  platformName: PropTypes.string.isRequired,
  subCount: PropTypes.number.isRequired,
  topics: PropTypes.string.isRequired,
  pricePerAdView: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};

export default PlatformListItem;
