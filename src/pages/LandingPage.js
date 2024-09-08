import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Container, Row, Col, Spinner, Stack,
} from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import SimpleListItem from '../components/ui/js/misc/SimpleListItem';
import PlatformIcon from '../images/empty_billboard_Vector.svg';
import CampaignIcon from '../images/cal_blowhorn_icon.svg';
import HomeView from '../components/ui/js/misc/HomeView';

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
  const navigateToCampaign = (campaignId) => {
    navigate(`/campaign/${campaignId}`);
    // Implement actual navigation logic here, such as routing to another page
  };

  useEffect(() => {
    document.title = 'CraigsAdList';
    // Fetch platforms, campaigns, and users data from the API
    const fetchData = async () => {
      try {
        const randomPlatformPage = Math.floor(Math.random() * 10) + 1;
        const randomCampaignPage = Math.floor(Math.random() * 5) + 1;

        const platformResponse = await fetch(`/return_results?for=platforms&page=${randomPlatformPage}&perPage=8`);
        const campaignResponse = await fetch(`/return_results?for=campaigns&page=${randomCampaignPage}&perPage=8`);

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
      <FadeIn>
        <Row>
          <HomeView />
        </Row>

        <Row>
          <Col>
            <a href="/search/platforms" style={{ float: 'right' }}>More.</a>
            <Stack direction="horizontal">
              <img
                style={{ height: '40px', width: '40px', paddingRight: '0.5rem' }}
                src={PlatformIcon}
                alt="Platform Icon"
              />
              <h3>Platforms</h3>
            </Stack>
            <Row className="mb-5">
              {platforms.map((platform) => (
                <Col className="mb-3" xs={12} md={6} key={platform.id}>
                  <SimpleListItem
                    name={platform.platformName}
                    metadata={`Monthly Impressions: ${platform.impressions.toLocaleString()}`}
                    pfp={platform.pfp}
                    isMobile={isMobile}
                    navigateToUserProfile={() => navigateToPlatform(platform.id)}
                  />
                </Col>
              ))}
            </Row>
            <a href="/search/campaigns" style={{ float: 'right' }}>More.</a>
            <Stack direction="horizontal">
              <img style={{ height: '40px', width: '40px' }} src={CampaignIcon} alt="Campaign Icon" />
              <h3>Ad Campaigns</h3>
            </Stack>
            <Row className="mb-5">
              {campaigns.map((campaign) => (
                <Col className="mb-3" xs={12} md={6} key={campaign.id}>
                  <SimpleListItem
                    name={campaign.campaignName}
                    metadata={`Budget: $${campaign.budget.toLocaleString()}`}
                    pfp={campaign.pfp}
                    isMobile={isMobile}
                    navigateToUserProfile={() => navigateToCampaign(campaign.id)}
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
      </FadeIn>
    </Container>

  );
}

export default LandingPage;
