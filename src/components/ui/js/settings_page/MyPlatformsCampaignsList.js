/* eslint-disable react/no-array-index-key */
// MyPlatformsCampaignsList.js

import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import MyPlatformListItem from './MyPlatformListItem';
import MyCampaignListItem from './MyCampaignListItem';

function MyPlatformsCampaignsList({ platforms, campaigns }) {
  // Sample platform data (replace with your actual data)
  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 2 }}>
          {platforms.length > 0 && (
          <div>
            <h2>My Platforms</h2>
            {platforms.map((platform, index) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
              <MyPlatformListItem key={index} {...platform} />
            ))}
          </div>
          )}
          {campaigns.length > 0 && (
            <div>
              <h2>My Campaigns</h2>
              {campaigns.map((campaign, index) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <MyCampaignListItem key={index} {...campaign} />
              ))}
            </div>
          )}
          {(platforms.length <= 0 && campaigns.length <= 0) && (
          <FadeIn>
            <div
              align="center"
              style={{ marginTop: '20vh' }}
            >
              <h3>Theres nothing here.</h3>

            </div>
          </FadeIn>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MyPlatformsCampaignsList;

MyPlatformsCampaignsList.defaultProps = {
  platforms: [],
  campaigns: [],
};

MyPlatformsCampaignsList.propTypes = {
  platforms: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    platformName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    impressions: PropTypes.number.isRequired,
    topics: PropTypes.string.isRequired,
    pricePerAdView: PropTypes.number.isRequired,
    pfp: PropTypes.string.isRequired,
  })),
  campaigns: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    topics: PropTypes.string.isRequired,
    pfp: PropTypes.string.isRequired,
  })),

};
