import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Row, Col, Image, ListGroup, Spinner,
} from 'react-bootstrap';
import PlatformListItem from '../components/ui/js/settings_page/PlatformListItem'; // Assuming you have a PlatformListItem component

function PlatformPage() {
  const [platform, setPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const platformId = params.id;

  const handlePlatformInfo = (newPlatform) => {
    setPlatform((prevPlatform) => ({
      ...prevPlatform,
      ...newPlatform,
    }));
  };

  useEffect(() => {
    if (platformId) {
      // Fetch platform details based on platformId
      fetch(`/return_selected_channel?id=${platformId}`, { method: 'GET' })
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

  if (!platform) {
    return (
      <div>
        <p>Platform not found.</p>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4}>
          {/* Platform Image */}
          {/* Assuming platform has an image field */}
          <Image
            src="https://lh3.googleusercontent.com/a/AATXAJyAoyxAHlPxYfdjPzbDWlo3nGAwjXr1qnwJ2ZST=s96-c"
            alt="Platform"
            fluid
            roundedCircle
            className="mb-3"
          />
          {/* Platform Name */}
          <h2>{platform.platformName}</h2>
          {/* Other platform details */}
          {/* Add more details as needed */}
        </Col>
        <Col md={8}>
          {/* Platform Stats */}
          <div className="mb-4">
            <h3>Platform Stats</h3>
            <ListGroup>
              <ListGroup.Item>
                <strong>Subscribers:</strong>
                {' '}
                {platform.subCount}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Topics:</strong>
                {' '}
                {platform.topics}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Preferred Price per Ad View:</strong>
                {' '}
                {platform.pricePerAdView}
                {' '}
                {/* platform.currency */}
              </ListGroup.Item>
              {/* Add more stats as needed */}
            </ListGroup>
          </div>
          {/* Edit and Delete buttons */}
          {/* Assuming you have functions for updating and deleting platforms */}
          {/* Pass these functions to PlatformListItem component */}
          <PlatformListItem
            id={platform.id}
            platformName={platform.platformName}
            subCount={platform.subCount}
            topics={platform.topics}
            pricePerAdView={platform.pricePerAdView}

          />
          {/* currency={platform.currency}
          onDelete={(id) => handleDeletePlatform(id)}
            onUpdate={
            (id, updatedPlatformName, updatedSubCount, updatedTopics, updatedPricePerAdView) =>
            handleUpdatePlatform(
                id, updatedPlatformName, updatedSubCount, updatedTopics, updatedPricePerAdView
                )} */}

        </Col>
      </Row>
    </Container>
  );
}

export default PlatformPage;
