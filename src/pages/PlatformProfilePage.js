import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Row, Col, ListGroup, Spinner, Card, Stack,
} from 'react-bootstrap';

import FadeIn from 'react-fade-in';
import CircleImage from '../components/ui/js/misc/CircleImage';

function PlatformProfilePage() {
  const [platform, setPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const platformId = params.id;

  const handlePlatformInfo = (newPlatform) => {
    document.title = `${newPlatform.platformName} - CraigsAdList`;
    setPlatform((prevPlatform) => ({
      ...prevPlatform,
      ...newPlatform,
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
    if (platformId) {
      // Fetch platform details based on platformId
      fetch(`/return_selected_platform?id=${platformId}`, { method: 'GET' })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Continue processing if status is okay
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        })
        .then((data) => {
          handlePlatformInfo(data);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error fetching platform details:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

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

  if (!loading && !platform) {
    document.title = '404 - CraigsAdList';
    return (
      <FadeIn>
        <div
          align="center"
          style={{ marginTop: '40vh' }}
        >
          <h1>404</h1>
          <l>This plaform cannot be found or does not exist.</l>
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
                {/* Profile Picture */}
                <FadeIn>
                  <CircleImage
                    src={platform.pfp}
                    alt="Profile"
                    size="large"
                    className="mb-3"
                  />
                  <h2>{platform.platformName}</h2>
                  <Stack direction="horizontal" gap={3}>
                    <Col>
                      <p>
                        <Card.Subtitle className="text-muted">
                          Monthy Impressions:
                        </Card.Subtitle>
                        {' '}
                        {platform.impressions.toLocaleString()}
                      </p>
                      {/* Phone number (if available) */}

                      <p>
                        <Card.Subtitle className="text-muted">
                          Owned by:
                        </Card.Subtitle>
                        {' '}
                        <a href={`/profile/${platform.ownerId}`} style={{ color: 'black' }}>{platform.ownerName}</a>
                      </p>

                    </Col>
                    <Col>
                      {/* Last login */}
                      <p>
                        <Card.Subtitle className="text-muted">
                          Platform Active?:
                        </Card.Subtitle>
                        {' '}
                        {platform.isActive.toLocaleString()}
                      </p>
                      {/* Date created */}
                      <p>
                        <Card.Subtitle className="text-muted">
                          Platform created:
                        </Card.Subtitle>
                        {' '}
                        {formatUnixTimestamp(platform.dateCreated)}
                      </p>
                    </Col>
                  </Stack>
                </FadeIn>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8}>
                <FadeIn>
                  {/* Bio Section inside a Bootstrap Card */}
                  <Card className="mb-4">
                    <Card.Header><h3>Plaform Description</h3></Card.Header>
                    <Card.Body>
                      <Card.Text>{platform.description}</Card.Text>
                    </Card.Body>
                  </Card>

                  {/* Conditional List (Campaigns or Platforms) */}
                  <div className="mb-4">
                    <Card.Header style={{ border: '1px solid rgba(0,0,0,.125)' }}><h3>Platform Statistics</h3></Card.Header>
                    <ListGroup>
                      <ListGroup.Item>
                        <strong>Medium:</strong>
                        {' '}
                        {platform.medium}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Monthy Impressions:</strong>
                        {' '}
                        {platform.impressions}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Topics:</strong>
                        {' '}
                        {platform.topics}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Preferred Price per Impressions:</strong>
                        {' $'}
                        {(platform.pricePerAdView / 100).toFixed(2)}
                        {' '}
                        {/* platform.currency */}
                      </ListGroup.Item>
                      {/* Add more stats as needed */}
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

export default PlatformProfilePage;
