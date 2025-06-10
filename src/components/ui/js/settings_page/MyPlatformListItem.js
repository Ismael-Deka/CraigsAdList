import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Button, Modal, Form, Toast,
} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import ImageSelectForm from '../misc/ImageSelectForm';

function MyPlatformListItem({
  id, platformName, description, impressions, topics,
  pricePerAdView, showPlatform, isActive, pfp,
}) {
  const [updatedPfp, setUpdatedPfp] = useState(pfp);
  const [updatedPlatformName, setUpdatedPlatformName] = useState(platformName);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedImpressions, setUpdatedImpressions] = useState(impressions);
  const [updatedTopics, setUpdatedTopics] = useState(topics);
  const [updatedPricePerAdView, setUpdatedPricePerAdView] = useState(pricePerAdView);
  const [updatedShowPlatform, setUpdatedShowPlatform] = useState(showPlatform);
  const [updatedIsActive, setUpdatedIsActive] = useState(isActive);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPfpToast, setShowPfpToast] = useState(false);
  const [pfpFailMessage, setPfpFailMessage] = useState('');

  const navigate = useNavigate();

  // Update state when prop values change
  useEffect(() => {
    setUpdatedPlatformName(platformName);
    setUpdatedDescription(description);
    setUpdatedImpressions(impressions);
    setUpdatedTopics(topics);
    setUpdatedPricePerAdView(pricePerAdView);
    setUpdatedShowPlatform(showPlatform);
    setUpdatedIsActive(isActive);
  }, [platformName, description, impressions, topics, pricePerAdView, showPlatform, isActive]);

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowWarningModal = () => setShowWarningModal(true);
  const handleCloseWarningModal = () => setShowWarningModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleUpdatePlatform = () => {
    // Validate inputs before updating
    if (!Number.isNaN(updatedImpressions) && !Number.isNaN(updatedPricePerAdView)) {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('updatedPfp', updatedPfp);
      formData.append('updatedPlatformName', updatedPlatformName);
      formData.append('updatedDescription', updatedDescription);
      formData.append('updatedImpressions', updatedImpressions);
      formData.append('updatedTopics', updatedTopics);
      formData.append('updatedPricePerAdView', updatedPricePerAdView);
      formData.append('updatedShowPlatform', updatedShowPlatform);
      formData.append('updatedIsActive', updatedIsActive);
      formData.append('isPfpChanged', updatedPfp !== pfp);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      fetch('/edit_platform', requestOptions).then((response) => response.json().then(
        (data) => {
          if (data.success) {
            const pfpSuccess = data.pfp_upload;
            if (!pfpSuccess && updatedPfp !== '') {
              setPfpFailMessage('Failed to update profile picture. Please try again.');
              setShowPfpToast(true);
            } else {
              setSuccessMessage('Profile updated successfully!');
              setShowSuccessModal(true);
              setTimeout(() => {
                window.location.reload();
              }, 4000);
            }
          } else {
            setErrorMessage('Failed to update profile information. Please try again.');
            setShowErrorModal(true);
          }
        },
      ));
      handleCloseEditModal();
    } else {
      // Show warning modal for invalid inputs
      handleShowWarningModal();
    }
  };

  const handleDeletePlatform = () => {
    // onDelete(id);
  };

  const navigateToPlatform = () => {
    navigate(`/platform/${id}`);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title onClick={navigateToPlatform} style={{ cursor: 'pointer' }}><h1>{platformName}</h1></Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Impressions:</Card.Subtitle>
        <Card.Text>{impressions}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">Topics:</Card.Subtitle>
        <Card.Text>{topics}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">Preferred Price per Ad View:</Card.Subtitle>
        <Card.Text>{pricePerAdView}</Card.Text>
        <Button variant="primary" onClick={handleShowEditModal}>
          Edit
        </Button>
        <Button variant="danger" className="ml-2" onClick={handleShowDeleteModal}>
          Delete
        </Button>
      </Card.Body>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Platform</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <ImageSelectForm currentProfilePic={pfp} setProfilePic={setUpdatedPfp} />
            <Form.Group controlId="editPlatformName">
              <Form.Label>Platform Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedPlatformName}
                onChange={(e) => setUpdatedPlatformName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
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
              <Form.Label>Preferred Price per Ad View(in cents)</Form.Label>
              <Form.Control
                type="number"
                value={updatedPricePerAdView}
                onChange={(e) => setUpdatedPricePerAdView(`$${e.target.value}`)}
              />
            </Form.Group>
            <Form.Group controlId="editShowPlatform">
              <Form.Check
                type="checkbox"
                label="Show Platform"
                checked={updatedShowPlatform}
                onChange={(e) => setUpdatedShowPlatform(e.target.checked)}
              />
            </Form.Group>
            <Form.Group controlId="editIsActive">
              <Form.Check
                type="checkbox"
                label="Is Active"
                checked={updatedIsActive}
                onChange={(e) => setUpdatedIsActive(e.target.checked)}
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

      {/* Warning Modal */ }
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

      {/* Delete Warning Modal */ }
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Platform Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete
          {' '}
          <strong>{platformName}</strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeletePlatform}>
            Delete Platform
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Toast onClose={() => setShowPfpToast(false)} show={showPfpToast} delay={5000}>
        <Toast.Header>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>{pfpFailMessage}</Toast.Body>
      </Toast>
    </Card>
  );
}

MyPlatformListItem.propTypes = {
  id: PropTypes.string.isRequired,
  platformName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  impressions: PropTypes.number.isRequired,
  topics: PropTypes.string.isRequired,
  pfp: PropTypes.string.isRequired,
  pricePerAdView: PropTypes.number.isRequired,
  showPlatform: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default MyPlatformListItem;
