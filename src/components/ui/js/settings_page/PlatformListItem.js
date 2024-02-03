// PlatformListItem.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Button, Modal, Form,
} from 'react-bootstrap';

function PlatformListItem({
  id, platformName, subCount, topics, pricePerAdView, currency, onDelete, onUpdate,
}) {
  const [updatedPlatformName, setUpdatedPlatformName] = useState(platformName);
  const [updatedSubCount, setUpdatedSubCount] = useState(subCount);
  const [updatedTopics, setUpdatedTopics] = useState(topics);
  const [updatedPricePerAdView, setUpdatedPricePerAdView] = useState(pricePerAdView);
  const [showEditModal, setShowEditModal] = useState(false);

  // Update state when prop values change
  useEffect(() => {
    setUpdatedPlatformName(platformName);
    setUpdatedSubCount(subCount);
    setUpdatedTopics(topics);
    setUpdatedPricePerAdView(pricePerAdView);
  }, [platformName, subCount, topics, pricePerAdView]);

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleUpdatePlatform = () => {
    // Validate inputs before updating
    if (!Number.isNaN(updatedSubCount) && !Number.isNaN(updatedPricePerAdView)) {
      onUpdate(id, updatedPlatformName, updatedSubCount, updatedTopics, updatedPricePerAdView);
      handleCloseEditModal();
    } else {
      // Handle invalid inputs (optional)
      alert('Please enter valid numbers for Subscribers and Price per Ad View.');
    }
  };

  const handleDeletePlatform = () => {
    onDelete(id);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h1>{platformName}</h1>
        <Card.Subtitle className="mb-2 text-muted">
          Subscribers:
        </Card.Subtitle>
        <Card.Text>{subCount}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">
          Topics:
        </Card.Subtitle>
        <Card.Text>{` ${topics}`}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">
          Preferred Price per Ad View:
        </Card.Subtitle>
        <Card.Text>
          {` ${pricePerAdView}`}
          {' '}
          {currency}
        </Card.Text>
        {onDelete && (
        <div>
          <Button variant="primary" onClick={handleShowEditModal}>
            Edit
          </Button>
          <Button variant="danger" className="ml-2" onClick={handleDeletePlatform}>
            Delete
          </Button>
        </div>
        )}
      </Card.Body>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Platform</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editPlatformName">
              <Form.Label>Platform Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedPlatformName}
                onChange={(e) => setUpdatedPlatformName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editSubCount">
              <Form.Label>Subscribers</Form.Label>
              <Form.Control
                type="number"
                value={updatedSubCount}
                onChange={(e) => setUpdatedSubCount(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editTopics">
              <Form.Label>Topics</Form.Label>
              <Form.Control
                type="text"
                value={updatedTopics}
                onChange={(e) => setUpdatedTopics(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editPricePerAdView">
              <Form.Label>Preferred Price per Ad View</Form.Label>
              <Form.Control
                type="number"
                value={updatedPricePerAdView}
                onChange={(e) => setUpdatedPricePerAdView(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePlatform}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

PlatformListItem.propTypes = {
  id: PropTypes.string.isRequired,
  platformName: PropTypes.string.isRequired,
  subCount: PropTypes.number.isRequired,
  topics: PropTypes.string.isRequired,
  pricePerAdView: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PlatformListItem;
