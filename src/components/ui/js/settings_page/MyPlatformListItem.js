import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Button, Modal, Form,
} from 'react-bootstrap';

function MyPlatformListItem({
  id, platformName, impressions, topics, pricePerAdView, onDelete, onUpdate,
}) {
  const [updatedPlatformName, setUpdatedPlatformName] = useState(platformName);
  const [updatedImpressions, setUpdatedImpressions] = useState(impressions);
  const [updatedTopics, setUpdatedTopics] = useState(topics);
  const [updatedPricePerAdView, setUpdatedPricePerAdView] = useState(pricePerAdView);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Update state when prop values change
  useEffect(() => {
    setUpdatedPlatformName(platformName);
    setUpdatedImpressions(impressions);
    setUpdatedTopics(topics);
    setUpdatedPricePerAdView(pricePerAdView);
  }, [platformName, impressions, topics, pricePerAdView]);

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowWarningModal = () => setShowWarningModal(true);
  const handleCloseWarningModal = () => setShowWarningModal(false);

  const handleUpdatePlatform = () => {
    // Validate inputs before updating
    if (!Number.isNaN(updatedImpressions) && !Number.isNaN(updatedPricePerAdView)) {
      onUpdate(id, updatedPlatformName, updatedImpressions, updatedTopics, updatedPricePerAdView);
      handleCloseEditModal();
    } else {
      // Show warning modal for invalid inputs
      handleShowWarningModal();
    }
  };

  const handleDeletePlatform = () => {
    onDelete(id);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h1>{platformName}</h1>
        <Card.Subtitle className="mb-2 text-muted">Impressions:</Card.Subtitle>
        <Card.Text>{impressions}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">Topics:</Card.Subtitle>
        <Card.Text>{topics}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">Preferred Price per Ad View:</Card.Subtitle>
        <Card.Text>{pricePerAdView}</Card.Text>
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
            <Form.Group controlId="editImpressions">
              <Form.Label>Impressions</Form.Label>
              <Form.Control
                type="number"
                value={updatedImpressions}
                onChange={(e) => setUpdatedImpressions(e.target.value)}
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
                onChange={(e) => setUpdatedPricePerAdView(`$${e.target.value}`)}
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

      {/* Warning Modal */}
      <Modal show={showWarningModal} onHide={handleCloseWarningModal}>
        <Modal.Header closeButton>
          <Modal.Title>Invalid Input</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please enter valid numbers for Price per Ad View.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWarningModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

MyPlatformListItem.propTypes = {
  id: PropTypes.string.isRequired,
  platformName: PropTypes.string.isRequired,
  impressions: PropTypes.number.isRequired,
  topics: PropTypes.string.isRequired,
  pricePerAdView: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default MyPlatformListItem;
