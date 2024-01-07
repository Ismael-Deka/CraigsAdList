import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import ChannelItem from './ChannelItem';

function ListOfChannels(props) {
  const { query, onReload } = props;
  const [channels, setChannels] = useState(Array(0));

  function getChannels(newQuery) {
    // fetch channels from database
    fetch(`/return_channels?for=channelsPage${newQuery}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setChannels(data.channelsData);
        } else {
          throw new Error('Error while fetching channels data');
        }
      });
  }

  useEffect(() => { getChannels(query); }, [props]);
  if (channels !== null) {
    if (channels.length === 0 || channels === null) {
      return (
        <h2 className="text-muted" align="center">
          No channels are found. Try different filters?
        </h2>
      );
    }
  }

  const listOfChannels = channels.map(
    (channel) => <ChannelItem channel={channel} onReload={onReload} />,
  );
  return (
    <Row xs={1} md={2} className="g-4">
      {listOfChannels}
    </Row>
  );
}

export default ListOfChannels;

ListOfChannels.defaultProps = {
  query: '',
  onReload: () => { },
};
ListOfChannels.propTypes = {
  query: PropTypes.string,
  onReload: PropTypes.func,
};
