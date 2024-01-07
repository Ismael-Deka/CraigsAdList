import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Modal, Container, Row, Col,
} from 'react-bootstrap';
import CircleImage from '../CircleImage';

function UserAccountForm({
  username, email, password, onSubmit,
}) {
  const [localUsername, setLocalUsername] = useState(username);
  const [localEmail, setLocalEmail] = useState(email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [originalPassword, setOriginalPassword] = useState('');

  const handleShowConfirmation = () => setShowConfirmation(true);
  const handleCloseConfirmation = () => setShowConfirmation(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleShowConfirmation();
  };

  const handleConfirmSubmit = () => {
    // You can perform validation here before submitting
    // For example, checking if the original password matches the entered one
    if (originalPassword !== password) {
      alert("Original password doesn't match!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New passwords don't match!");
      return;
    }

    onSubmit({
      username: localUsername,
      email: localEmail,
      password: newPassword,
    });
    handleCloseConfirmation();
  };

  useEffect(() => {
    fetch('/account_info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocalEmail(data.account.email);
        setLocalUsername(data.account.username);
      });
  }, []);

  const handleProfilePictureChange = (event) => {
    // eslint-disable-next-line no-unused-vars
    const file = event.target.files[0];
    // You can perform additional checks or handle the file as needed
    // For example, you may want to display a preview of the selected image.
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 2 }}>
          <h2>My Account</h2>
          {/* Profile Picture */}
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="profilePictureInput">
            <CircleImage
              src="https://lh3.googleusercontent.com/a/AATXAJyAoyxAHlPxYfdjPzbDWlo3nGAwjXr1qnwJ2ZST=s96-c"
              onClick={() => document.getElementById('profilePictureInput').click()}
            />
          </label>
          <input
            type="file"
            id="profilePictureInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
          <Form onSubmit={handleSubmit}>
            <h4 className="mt-5">Edit Profile</h4>
            <hr className="hr hr-blurry" />
            <Form.Group className="mb-3 mt-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button className="mb-5" variant="primary" type="submit">
              Save Changes
            </Button>

            <h4 className="mt-5">Change Password</h4>
            <hr className="hr hr-blurry" />
            <Form.Group className="mb-3" controlId="originalPassword">
              <Form.Label>Original Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your original password"
                value={originalPassword}
                onChange={(e) => setOriginalPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmNewPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button className="mb-5" variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>

          {/* Confirmation Modal */}
          <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to submit the form?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmation}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmSubmit}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

UserAccountForm.propTypes = {
  username: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  onSubmit: PropTypes.func,
};

UserAccountForm.defaultProps = {
  username: '',
  email: '',
  password: '',
  onSubmit: 4,
};

export default UserAccountForm;
