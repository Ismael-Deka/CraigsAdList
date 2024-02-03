/* eslint-disable react/no-array-index-key */
// PlatformManagementPage.js

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import PlatformListItem from './PlatformListItem';

function PlatformManagementPage({ platforms }) {
  // Sample platform data (replace with your actual data)

  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 2 }}>
          <h2>My Platforms</h2>
          {platforms.map((platform, index) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <PlatformListItem key={index} {...platform} />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default PlatformManagementPage;

PlatformManagementPage.propTypes = {
  platforms: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    platformName: PropTypes.string.isRequired,
    subCount: PropTypes.number.isRequired,
    topics: PropTypes.string.isRequired,
    pricePerAdView: PropTypes.number.isRequired,
  })).isRequired,

};
