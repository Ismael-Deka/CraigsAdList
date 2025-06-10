import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Button, Modal, Form, Toast, Col, Stack,
} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import ImageSelectForm from '../misc/ImageSelectForm';
import CircleImage from '../misc/CircleImage';

function MyCampaignListItem({
  id, title, description, topics, budget,
  currency, showInList, isActive, startDate, endDate, pfp,
}) {
  const [updatedPfp, setUpdatedPfp] = useState(pfp);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedTopics, setUpdatedTopics] = useState(topics);
  const [updatedBudget, setUpdatedBudget] = useState(budget);
  const [updatedCurrency, setUpdatedCurrency] = useState(currency);
  const [updatedShowInList, setUpdatedShowInList] = useState(showInList);
  const [updatedIsActive, setUpdatedIsActive] = useState(isActive);
  const [updatedStartDate, setUpdatedStartDate] = useState(startDate);
  const [updatedEndDate, setUpdatedEndDate] = useState(endDate);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPfpToast, setShowPfpToast] = useState(false);
  const [pfpFailMessage, setPfpFailMessage] = useState('');

  const [isScreenSmall, setSmallScreen] = useState(window.innerWidth < 1200);

  const navigate = useNavigate();

  const convertFromUnixTime = (unixTimestamp) => {
    // Create a new Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unixTimestamp * 1000);

    // Format the date to yyyy-mm-dd
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const convertToUnixTime = (dateString) => {
    // Create a new Date object from the yyyy-mm-dd string
    const date = new Date(dateString);

    // Get the Unix timestamp in milliseconds and convert it to seconds
    const unixTime = Math.floor(date.getTime() / 1000);

    return unixTime;
  };

  // Update state when prop values change
  useEffect(() => {
    setUpdatedTitle(title);
    setUpdatedDescription(description);
    setUpdatedTopics(topics);
    setUpdatedBudget(budget);
    setUpdatedCurrency(currency);
    setUpdatedShowInList(showInList);
    setUpdatedIsActive(isActive);
    setUpdatedStartDate(convertFromUnixTime(startDate));
    setUpdatedEndDate(convertFromUnixTime(endDate));
  }, [title, description, topics, budget, currency, showInList, isActive, startDate, endDate]);

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowWarningModal = () => setShowWarningModal(true);
  const handleCloseWarningModal = () => setShowWarningModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Debounced resize handler
  const handleWindowResize = useCallback(() => {
    setSmallScreen(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    let timeoutId = null;

    const debouncedResizeHandler = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        handleWindowResize();
      }, 100); // Adjust the delay (200ms) as needed
    };

    // Add event listener for window resize
    window.addEventListener('resize', debouncedResizeHandler);

    // Cleanup function to remove event listener and clear any pending timeouts
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleWindowResize]);

  const handleUpdateCampaign = () => {
    // Validate inputs before updating
    if (!Number.isNaN(updatedBudget)) {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('updatedPfp', updatedPfp);
      formData.append('updatedTitle', updatedTitle);
      formData.append('updatedDescription', updatedDescription);
      formData.append('updatedTopics', updatedTopics);
      formData.append('updatedBudget', updatedBudget);
      formData.append('updatedCurrency', updatedCurrency);
      formData.append('updatedShowInList', updatedShowInList);
      formData.append('updatedIsActive', updatedIsActive);
      formData.append('updatedStartDate', convertToUnixTime(updatedStartDate));
      formData.append('updatedEndDate', convertToUnixTime(updatedEndDate));
      formData.append('isPfpChanged', updatedPfp !== pfp);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      fetch('/edit_campaign', requestOptions).then((response) => response.json().then(
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
            setErrorMessage('Failed to update campaign. Please try again.');
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

  const handleDeleteCampaign = () => {
    // onDelete(id);
  };

  const navigateToCampaign = () => {
    navigate(`/campaign/${id}`);
  };

  return (
    <Card className="mb-3">

      <Card.Body>
        <Stack direction={isScreenSmall ? 'vertical' : 'horizontal'}>
          <Col>
            <CircleImage src={pfp} />
          </Col>
          <Col>
            <Card.Title onClick={navigateToCampaign} style={{ cursor: 'pointer' }}><h1>{title}</h1></Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Topics:</Card.Subtitle>
            <Card.Text>{topics}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">Budget:</Card.Subtitle>
            <Card.Text>{`${currency} ${budget}`}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">Start Date:</Card.Subtitle>
            <Card.Text>{updatedStartDate}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">End Date:</Card.Subtitle>
            <Card.Text>{updatedEndDate}</Card.Text>
          </Col>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" onClick={handleShowEditModal}>
          Edit
        </Button>
        <Button variant="danger" className="m-2" onClick={handleShowDeleteModal}>
          Delete
        </Button>
      </Card.Footer>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <ImageSelectForm currentProfilePic={pfp} setProfilePic={setUpdatedPfp} />
            <Form.Group controlId="editTitle">
              <Form.Label>Campaign Title</Form.Label>
              <Form.Control
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
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
            <Form.Group controlId="editTopics">
              <Form.Label>Topics</Form.Label>
              <Form.Control
                type="text"
                value={updatedTopics}
                onChange={(e) => setUpdatedTopics(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editBudget">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type="number"
                value={updatedBudget}
                onChange={(e) => setUpdatedBudget(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editCurrency">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                disabled
                type="text"
                value={updatedCurrency}
                onChange={(e) => setUpdatedCurrency(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editShowInList">
              <Form.Check
                type="checkbox"
                label="Show in List"
                checked={updatedShowInList}
                onChange={(e) => setUpdatedShowInList(e.target.checked)}
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
            <Form.Group controlId="editStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={updatedStartDate}
                onChange={(e) => setUpdatedStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={updatedEndDate}
                onChange={(e) => setUpdatedEndDate(e.target.value)}
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
          Please enter valid numbers for the budget.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWarningModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Warning Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Platform Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete
          {' '}
          <strong>{title}</strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteCampaign}>
            Delete Campaign
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

MyCampaignListItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  topics: PropTypes.string.isRequired,
  budget: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  showInList: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  pfp: PropTypes.string.isRequired,
};

export default MyCampaignListItem;
