import React, { useState, useEffect } from 'react';
import {
  Form, Button, Modal, Container, Row, Col,
} from 'react-bootstrap';
import CircleImage from '../CircleImage';

function UserAccountForm() {
  const [localUsername, setLocalUsername] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [localPfp, setLocalPfp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [originalPassword, setOriginalPassword] = useState('');

  const handleShowConfirmation = () => setShowConfirmation(true);
  const handleCloseConfirmation = () => setShowConfirmation(false);
  // Confirmation Modal State
  const [submittingForm, setSubmittingForm] = useState(null);

  const handleConfirmSubmit = (formType) => {
    setSubmittingForm(formType); // Set the form type that is about to be submitted
    handleShowConfirmation();
  };

  const handleFinalSubmit = () => {
    if (submittingForm === 'profile') {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: localUsername,
          email: localEmail,
        }),
      };
      fetch('/edit_profile', requestOptions).then((reponse) => reponse.json().then(
        (data) => {
          console.log(data.success);
        },
      ));
    } else if (submittingForm === 'password') {
      if (originalPassword !== '') {
        // alert("Original password doesn't match!");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        // alert("New passwords don't match!");
        return;
      }
    }

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
        setLocalPfp(data.account.pfp);
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
              src={localPfp}
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
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleConfirmSubmit('profile');
          }}
          >
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
              Save Profile Changes
            </Button>
          </Form>
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleConfirmSubmit('password');
          }}
          >
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
              Save Password Changes
            </Button>
          </Form>

          {/* Confirmation Modal */}
          <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to submit these changes?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmation}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleFinalSubmit}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default UserAccountForm;
