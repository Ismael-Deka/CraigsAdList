import React, { useState, useEffect } from 'react';
import {
  Form, Button, Modal, Container, Row, Col, Stack, Toast,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import CircleImage from '../misc/CircleImage';

// eslint-disable-next-line no-unused-vars
function UserAccountForm({ account }) {
  const [localUsername, setLocalUsername] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [localProfilePic, setLocalPfp] = useState('');

  const [currentProfilePic, setCurrentPfp] = useState('');

  const [emailFormatError, setEmailFormatError] = useState('');

  const [originalPassword, setOriginalPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showSuccesModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [showPfpToast, setShowPfpToast] = useState(false);
  const [pfpFailMessage, setPfpFailMessage] = useState('');

  const [showProfileToast, setShowProfileToast] = useState(false);
  const [profileFailMessage, setProfileFailMessage] = useState('');

  const handleShowConfirmation = () => setShowConfirmationModal(true);
  const handleCloseConfirmation = () => setShowConfirmationModal(false);
  // Confirmation Modal State
  const [submittingForm, setSubmittingForm] = useState(null);

  const handleConfirmSubmit = (formType) => {
    if (formType === 'profile' && emailFormatError) {
      // If there's an email format error, prevent form submission
      return;
    } if (formType === 'password') {
      if (newPassword !== confirmNewPassword) {
        setErrorMessage("New passwords don't match!");
        setShowErrorModal(true);
        return;
      }
    }
    setSubmittingForm(formType);
    handleShowConfirmation();
  };

  const handleFinalSubmit = () => {
    const formData = new FormData();

    if (submittingForm === 'profile') {
      formData.append('pfp', localProfilePic);
      formData.append('is_pfp_changed', localProfilePic !== '');
      formData.append('username', localUsername);
      formData.append('email', localEmail);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      fetch('/edit_profile', requestOptions).then((reponse) => reponse.json().then(
        (data) => {
          if (data.success) {
            const pfpSuccess = data.pfp_upload;
            const storedUserData = JSON.parse(localStorage.getItem('userData'));
            if (storedUserData) {
              localStorage.removeItem('userData');
            }
            if (!pfpSuccess && localProfilePic !== '') {
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
            setProfileFailMessage('Failed to update profile information. Please try again.');
            setShowProfileToast(true); // Show the toast
          }
        },
      ));
    } else if (submittingForm === 'password') {
      formData.append('original_pass', originalPassword);
      formData.append('new_pass', newPassword);
      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      fetch('/change_pass', requestOptions).then((reponse) => reponse.json().then(
        (data) => {
          if (data.success) {
            setSuccessMessage('Password changed successfully!');
            setShowSuccessModal(true);
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          } else {
            setErrorMessage(data.error_message);
            setShowErrorModal(true);
          }
        },
      ));
    }

    // Close the confirmation modal if open
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
        setCurrentPfp(data.account.pfp);
      });
  }, []);

  const handleProfilePictureChange = (event) => {
    // eslint-disable-next-line no-unused-vars
    const selectedPfp = event.target.files[0];
    const reader = new FileReader();
    setLocalPfp(selectedPfp);

    reader.readAsDataURL(selectedPfp);

    reader.onload = () => {
      const base64Pfp = reader.result;
      setCurrentPfp(base64Pfp);
    };
  };

  const validateEmail = (email) => {
    // Regular expression for email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setLocalEmail(value);
    if (!validateEmail(value)) {
      setEmailFormatError('Please enter a valid email address.');
    } else {
      setEmailFormatError('');
    }
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 2 }}>

          <h2>My Account</h2>
          {/* Profile Picture */}
          <h4 className="mt-5">Change Profile Picture</h4>
          <hr className="hr hr-blurry" />
          <Stack gap={5} style={{ alignItems: 'center' }}>
            <CircleImage
              src={currentProfilePic}
            />
            <Form>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" accept="image/*" onChange={handleProfilePictureChange} />
              </Form.Group>
            </Form>
          </Stack>
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
                onChange={handleEmailChange}
                required
              />
              {emailFormatError && <Form.Text className="text-danger">{emailFormatError}</Form.Text>}
            </Form.Group>

            <Button className="mb-5" variant="primary" type="submit">
              Save Profile Changes
            </Button>
          </Form>
          <Toast onClose={() => setShowPfpToast(false)} show={showPfpToast} delay={5000}>
            <Toast.Header>
              <strong className="mr-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>{pfpFailMessage}</Toast.Body>
          </Toast>
          <Toast
            onClose={() => setShowProfileToast(false)}
            show={showProfileToast}
            delay={5000}
          >
            <Toast.Header>
              <strong className="mr-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>{profileFailMessage}</Toast.Body>
          </Toast>
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
          <Modal show={showConfirmationModal} onHide={handleCloseConfirmation}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure you want to submit these changes?</div>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmation}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleFinalSubmit}>
                Confirm
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

          {/* Error Modal */}
          <Modal show={showSuccesModal} onHide={() => setShowSuccessModal(false)}>
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

        </Col>
      </Row>
    </Container>
  );
}

export default UserAccountForm;

UserAccountForm.propTypes = {
  account: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    pfp: PropTypes.string.isRequired,
    platformName: PropTypes.string.isRequired,
  })).isRequired,

};
