import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Button, Modal, Form,
} from 'react-bootstrap';

function MyCampaignListItem({
  id, title, description, budget, topics, pfp, onDelete, onUpdate,
}) {
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedBudget, setUpdatedBudget] = useState(budget);
  const [updatedTopics, setUpdatedTopics] = useState(topics);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Update state when prop values change
  useEffect(() => {
    setUpdatedTitle(title);
    setUpdatedDescription(description);
    setUpdatedBudget(budget);
    setUpdatedTopics(topics);
  }, [title, description, budget, topics]);

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowWarningModal = () => setShowWarningModal(true);
  const handleCloseWarningModal = () => setShowWarningModal(false);

  const handleUpdateCampaign = () => {
    // Validate inputs before updating
    if (!Number.isNaN(updatedBudget)) {
      onUpdate(id, updatedTitle, updatedDescription, updatedBudget, updatedTopics);
      handleCloseEditModal();
    } else {
      // Show warning modal for invalid inputs
      handleShowWarningModal();
    }
  };

  const handleDeleteCampaign = () => {
    onDelete(id);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h1>{title}</h1>
        <Card.Img variant="top" src={pfp} alt="Campaign image" />
        <Card.Subtitle className="mb-2 text-muted">Description:</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">Budget:</Card.Subtitle>
        <Card.Text>{budget}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">Topics:</Card.Subtitle>
        <Card.Text>{topics}</Card.Text>
        {onDelete && (
        <div>
          <Button variant="primary" onClick={handleShowEditModal}>
            Edit
          </Button>
          <Button variant="danger" className="ml-2" onClick={handleDeleteCampaign}>
            Delete
          </Button>
        </div>
        )}
      </Card.Body>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editCampaignTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editCampaignDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editCampaignBudget">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type="number"
                value={updatedBudget}
                onChange={(e) => setUpdatedBudget(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editCampaignTopics">
              <Form.Label>Topics</Form.Label>
              <Form.Control
                type="text"
                value={updatedTopics}
                onChange={(e) => setUpdatedTopics(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCampaign}>
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
          Please enter a valid number for the budget.
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

MyCampaignListItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  budget: PropTypes.number.isRequired,
  topics: PropTypes.string.isRequired,
  pfp: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default MyCampaignListItem;
