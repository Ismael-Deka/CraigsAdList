import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Container, Row, Col, Spinner,
} from 'react-bootstrap';
import SimpleListItem from '../components/ui/js/misc/SimpleListItem';

function LandingPage() {
  const [platforms, setPlatforms] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  // Navigation functions for handling clicks on items
  const navigateToPlatform = (platformId) => {
    navigate(`/platform/${platformId}`);
    // Implement actual navigation logic here, such as routing to another page
  };

  useEffect(() => {
    // Fetch platforms, campaigns, and users data from the API
    const fetchData = async () => {
      try {
        const randomPlatformPage = Math.floor(Math.random() * 10) + 1;
        const randomCampaignPage = Math.floor(Math.random() * 8) + 1;

        const platformResponse = await fetch(`/return_results?for=platforms&page=${randomPlatformPage}&perPage=4`);
        const campaignResponse = await fetch(`/return_results?for=campaigns&page=${randomCampaignPage}&perPage=4`);

        const platformData = await platformResponse.json();
        const campaignData = await campaignResponse.json();

        if (platformData.success) {
          setPlatforms(platformData.platformsData);
        }
        if (campaignData.success) {
          setCampaigns(campaignData.campaignsData);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to CraigsAdList!</h1>
          <p>Discover platforms, ad campaigns, and more.</p>
          <p style={{ fontSize: '0.6rem' }}>(Pardon the mess. This site is still under construction.)</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <a href="/search/platforms" style={{ float: 'right' }}>More.</a>
          <h3>Platforms</h3>

          <Row className="mb-5">
            {platforms.map((platform) => (
              <Col xs={12} md={6} key={platform.id}>
                <SimpleListItem
                  name={platform.platformName}
                  metadata={`Impressions: ${platform.impressions.toLocaleString()}`}
                  pfp={platform.pfp}
                  isMobile={isMobile}
                  navigateToUserProfile={() => navigateToPlatform(platform.id)}
                />
              </Col>
            ))}
          </Row>
          <a href="/search/campaigns" style={{ float: 'right' }}>More.</a>
          <h3>Ad Campaigns</h3>

          <Row className="mb-5">
            {campaigns.map((campaign) => (
              <Col xs={12} md={6} key={campaign.id}>
                <SimpleListItem
                  name={campaign.campaignName}
                  metadata={`Budget: $${campaign.budget.toLocaleString()}`}
                  pfp={campaign.pfp}
                  isMobile={isMobile}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <div style={{
        bottom: 0,
        textAlign: 'center',
      }}
      >
        <p style={{ fontSize: 'small' }}>Made by: Ismael Deka, Subhash Tanikella, Pavel Popov, Utsav Patel (2022)</p>
      </div>
    </Container>

  );
}

export default LandingPage;
