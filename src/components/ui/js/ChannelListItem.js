// ChannelListItem.js

import React from 'react';
import PropTypes from 'prop-types';

function ChannelListItem({
  channelName, subCount, topics, pricePerAdView, currency,
}) {
  return (
    <div className="channel-list-item">
      <h4>{channelName}</h4>
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

ChannelListItem.propTypes = {
  channelName: PropTypes.string.isRequired,
  subCount: PropTypes.number.isRequired,
  topics: PropTypes.string.isRequired,
  pricePerAdView: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};

export default ChannelListItem;
