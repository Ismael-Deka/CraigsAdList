/* eslint-disable react/no-array-index-key */
// PlatformManagementPage.js

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PlatformListItem from './PlatformListItem';

function PlatformManagementPage() {
  // Sample platform data (replace with your actual data)
  const platforms = [
    {
      platformName: 'Platform A',
      subCount: 1000000,
      topics: 'Technology',
      pricePerAdView: 0.25, // in dollars
      currency: 'USD',
    },
    {
      platformName: 'Platform B',
      subCount: 500000,
      topics: 'Gaming',
      pricePerAdView: 15, // in cents
      currency: 'cents',
    },
    // Add more platform data as needed
  ];

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
