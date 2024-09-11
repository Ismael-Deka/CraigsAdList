import React, { useState, useEffect } from 'react';
import {
  Form, Button, Modal, Container, Row, Col, Toast,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ImageSelectForm from '../misc/ImageSelectForm';

function UserAccountForm() {
  const [localUsername, setLocalUsername] = useState('');
  const [localFullName, setLocalFullName] = useState(''); // Full Name state
  const [localPhoneNumber, setLocalPhoneNumber] = useState(''); // Phone Number state
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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [showPfpToast, setShowPfpToast] = useState(false);
  const [pfpFailMessage, setPfpFailMessage] = useState('');

  const [submittingForm, setSubmittingForm] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete Account modal state

  const handleShowConfirmation = () => setShowConfirmationModal(true);
  const handleCloseConfirmation = () => setShowConfirmationModal(false);

  const handleShowDeleteModal = () => setShowDeleteModal(true); // Open delete modal
  const handleCloseDeleteModal = () => setShowDeleteModal(false); // Close delete modal

  const handleConfirmSubmit = (formType) => {
    if (formType === 'profile' && emailFormatError) return;
    if (formType === 'password' && newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords don't match!");
      setShowErrorModal(true);
      return;
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
      formData.append('full_name', localFullName); // Include full name in profile update
      formData.append('phone_number', localPhoneNumber); // Include phone number in profile update

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      fetch('/edit_user_profile', requestOptions).then((response) => response.json().then(
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
            setErrorMessage('Failed to update profile information. Please try again.');
            setShowErrorModal(true);
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
      fetch('/change_pass', requestOptions).then((response) => response.json().then(
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

    handleCloseConfirmation(); // Close the confirmation modal
  };

  const handleProfilePictureChange = (event) => {
    const selectedPfp = event.target.files[0];
    const reader = new FileReader();
    setLocalPfp(selectedPfp);

    reader.readAsDataURL(selectedPfp);

    reader.onload = () => {
      const base64Pfp = reader.result;
      setCurrentPfp(base64Pfp);
    };
  };

  const handleDeleteAccount = () => {
    fetch('/delete_current_user', { method: 'POST' })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage('Account successfully deleted.');
          setShowSuccessModal(true);
          setTimeout(() => {
            fetch('/handle_logout');
            window.location.reload();
          }, 4000);
        } else {
          setErrorMessage('Failed to delete the account.');
          setShowErrorModal(true);
        }
      });
    handleCloseDeleteModal(); // Close delete confirmation modal
  };

  const validateEmail = (email) => {
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
        setLocalFullName(data.account.full_name || ''); // Load full name
        setLocalPhoneNumber(data.account.phone || ''); // Load phone number
      });
  }, []);

  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 2 }}>
          <h2>My Account</h2>

          {/* Use ImageSelectForm Component */}
          <h4 className="mt-5">Change Profile Picture</h4>
          <hr className="hr hr-blurry" />
          <ImageSelectForm
            currentProfilePic={currentProfilePic}
            handleProfilePictureChange={handleProfilePictureChange}
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

            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                value={localFullName}
                onChange={(e) => setLocalFullName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={localPhoneNumber}
                onChange={(e) => setLocalPhoneNumber(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                value={localEmail}
                onChange={(e) => handleEmailChange(e)}
                required
              />
              {emailFormatError && <Form.Text className="text-danger">{emailFormatError}</Form.Text>}
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

          <h4 className="mt-5">Danger Zone</h4>
          <hr className="hr hr-blurry" />
          <Button className="mb-5" variant="danger" onClick={handleShowDeleteModal}>
            Delete Account
          </Button>

          <Toast onClose={() => setShowPfpToast(false)} show={showPfpToast} delay={5000}>
            <Toast.Header>
              <strong className="mr-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>{pfpFailMessage}</Toast.Body>
          </Toast>

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

          {/* Delete Confirmation Modal */}
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Account Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to permanently delete your account?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

UserAccountForm.propTypes = {
  account: PropTypes.shape({
    username: PropTypes.string.isRequired,
    pfp: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserAccountForm;
