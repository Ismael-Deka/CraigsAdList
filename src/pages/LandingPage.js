import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Carousel, Spinner,
} from 'react-bootstrap';
import PlatformItem from '../components/ui/js/search_page/platforms/PlatformItem';
import AdCampaignItem from '../components/ui/js/search_page/ads/AdCampaignItem';
import UserItem from '../components/ui/js/search_page/users/UserItem';

function LandingPage() {
  const [platforms, setPlatforms] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch platforms, campaigns, and users data from the API
    const fetchData = async () => {
      try {
        const platformResponse = await fetch('/return_results?for=platforms&page=2&perPage=4');
        const campaignResponse = await fetch('/return_results?for=campaigns&page=2&perPage=4');
        const userResponse = await fetch('/return_results?for=users&page=2&perPage=4');

        const platformData = await platformResponse.json();
        const campaignData = await campaignResponse.json();
        const userData = await userResponse.json();

        if (platformData.success) {
          setPlatforms(platformData.platformsData);
        }
        if (campaignData.success) {
          setCampaigns(campaignData.campaignsData);
        }
        if (userData.success) {
          setUsers(userData.accountsData);
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
          <p>Discover platforms, ad campaigns, and users.</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Platforms</h3>
          <Carousel>
            {platforms.map((platform) => (
              <Carousel.Item key={platform.id}>
                <PlatformItem platform={platform} />
              </Carousel.Item>
            ))}
          </Carousel>

          <h3>Ad Campaigns</h3>
          <Carousel>
            {campaigns.map((campaign) => (
              <Carousel.Item key={campaign.id}>
                <AdCampaignItem campaign={campaign} />
              </Carousel.Item>
            ))}
          </Carousel>

          <h3>Users</h3>
          <Carousel>
            {users.map((user) => (
              <Carousel.Item key={user.id}>
                <UserItem user={user} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}

export default LandingPage;
