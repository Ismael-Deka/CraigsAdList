import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Row, Col, ListGroup, Spinner, Card, Stack,
} from 'react-bootstrap';

import FadeIn from 'react-fade-in';
import CircleImage from '../components/ui/js/misc/CircleImage'; // Assuming campaigns have a profile picture similar to platforms

function CampaignProfilePage() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const campaignId = params.id;

  const handleCampaignInfo = (newCampaign) => {
    document.title = `${newCampaign.title} - CraigsAdList`;
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      ...newCampaign,
    }));
  };

  const formatUnixTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const options = {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric',
    };
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return date.toLocaleString('en-US', options); // Format to readable string
  };

  useEffect(() => {
    if (campaignId) {
      // Fetch campaign details based on campaignId
      fetch(`/return_selected_campaign?id=${campaignId}`, { method: 'GET' })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Continue processing if status is okay
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        })
        .then((data) => {
          handleCampaignInfo(data);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error fetching campaign details:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [campaignId]);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      }}
      >
        <Spinner animation="border" role="status" variant="secondary" />
      </div>
    );
  }

  if (!loading && !campaign) {
    document.title = '404 - CraigsAdList';
    return (
      <FadeIn>
        <div
          align="center"
          style={{ marginTop: '40vh' }}
        >
          <h1>404</h1>
          <p>This campaign cannot be found or does not exist.</p>
          <p>Please try again later.</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <Container className="mt-5">
      {loading ? (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
        >
          <Spinner animation="border" role="status" size="sm" variant="secondary" />
        </div>
      ) : (
        <div>
          <Col>
            <Row className="justify-content-center">
              <Col className="mb-5" md={8} alignItem="center">
                {/* Campaign Profile Picture */}
                <FadeIn>
                  <CircleImage
                    src={campaign.pfp} // Assuming campaigns have a profile picture
                    alt="Campaign Profile"
                    size="large"
                    className="mb-3"
                  />
                  <h2>{campaign.title}</h2>
                  <Stack direction="horizontal" gap={3}>
                    <Col>
                      <p>
                        <Card.Subtitle className="text-muted">
                          Campaign Creator:
                        </Card.Subtitle>
                        {' '}
                        <a
                          href={`/profile/${campaign.creatorId}`}
                          style={{ color: 'black' }}
                        >
                          {campaign.creatorName}
                        </a>
                      </p>
                      <p>
                        <Card.Subtitle className="text-muted">
                          Campaign Active?:
                        </Card.Subtitle>
                        {' '}
                        {((Math.floor(Date.now() / 1000)) < campaign.endDate).toString()}
                      </p>
                    </Col>
                    <Col>
                      {/* Date created */}

                      <p>
                        <Card.Subtitle className="text-muted">
                          Campaign Start Date:
                        </Card.Subtitle>
                        {' '}
                        {formatUnixTimestamp(campaign.startDate)}
                      </p>
                      <p>
                        <Card.Subtitle className="text-muted">
                          Campaign End Date:
                        </Card.Subtitle>
                        {' '}
                        {formatUnixTimestamp(campaign.endDate)}
                      </p>
                    </Col>
                  </Stack>
                </FadeIn>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8}>
                <FadeIn>
                  {/* Campaign Description */}
                  <Card className="mb-4">
                    <Card.Header><h3>Campaign Description</h3></Card.Header>
                    <Card.Body>
                      <Card.Text>{campaign.description}</Card.Text>
                    </Card.Body>
                  </Card>

                  {/* Campaign Statistics */}
                  <div className="mb-4">
                    <Card.Header style={{ border: '1px solid rgba(0,0,0,.125)' }}><h3>Campaign Details</h3></Card.Header>
                    <ListGroup>
                      <ListGroup.Item>
                        <strong>Budget:</strong>
                        {' $'}
                        {campaign.budget ? campaign.budget.toLocaleString() : 'N/A'}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Currency:</strong>
                        {' '}
                        {campaign.currency}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Topics:</strong>
                        {' '}
                        {campaign.topics}
                      </ListGroup.Item>

                    </ListGroup>
                  </div>
                </FadeIn>
              </Col>
            </Row>
          </Col>
        </div>
      )}
    </Container>
  );
}

export default CampaignProfilePage;
