import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Row, Col, ListGroup, Spinner, Button, Modal, Form,
} from 'react-bootstrap';
import PlatformListItem from '../components/ui/js/settings_page/PlatformListItem';
import CircleImage from '../components/ui/js/CircleImage';

function ProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [decodedPfp, setDecodedPfp] = useState('');
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState('');

  const params = useParams();
  const userId = params.id;

  // Open the new message modal
  const handleShowMessageModal = () => {
    setShowMessageModal(true);
  };

  // Close the new message modal
  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
  };

  // Handle sending a new message (add your own logic)
  const handleSendMessage = () => {
    // Add your logic here to send the new message
    // For example, you can make an API call to send the message
    // Reset the new message content and close the modal
    setNewMessageContent('');
    setShowMessageModal(false);
  };

  useEffect(() => {
    if (userId) {
      fetch(`/account_info?id=${userId}`, { method: 'GET' })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Continue processing if status is okay
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        })
        .then((data) => {
          setUsername(data.account.username);
          setEmail(data.account.email);
          setDecodedPfp(data.account.pfp);
          setPlatforms(data.platforms);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error fetching user profile:', error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false regardless of success or failure
        });
    }
  }, [userId]);
  return (
    <Container className="mt-5">
      {loading ? (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
        >
          <Spinner animation="border" role="status" size="sm" variant="secondary" />
        </div>
      ) : (
        <div>
          <Row>
            <Col md={4}>
              {/* Profile Picture */}
              <CircleImage
                src={decodedPfp}
                alt="Profile"
                size="large"
                className="mb-3"
              />
              {/* Username */}
              <h2>{username}</h2>
              {/* Email */}
              <p>
                Email:
                {` ${email}`}

              </p>
              <Button variant="primary" onClick={handleShowMessageModal}>
                Send Message
              </Button>
            </Col>
            <Col md={8}>
              {/* Platforms Owned */}
              <div className="mb-4">
                <h3>Platforms Owned</h3>
                <ListGroup>
                  {platforms.map((platform) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                    <PlatformListItem key={platform.id} {...platform} />
                  ))}
                </ListGroup>
              </div>
              {/* Propositions */}
              <div>
                <h3>Propositions</h3>
                <ListGroup>
                  <ListGroup.Item>Proposition 1</ListGroup.Item>
                  <ListGroup.Item>Proposition 2</ListGroup.Item>
                  {/* Add more propositions as needed */}
                </ListGroup>
              </div>
            </Col>
          </Row>
          {/* New Message Modal */}
          <Modal show={showMessageModal} onHide={handleCloseMessageModal}>
            <Modal.Header closeButton>
              <Modal.Title>New Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="newMessageContent">
                <Form.Label>Message Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseMessageModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSendMessage}>
                Send Message
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </Container>
  );
}

export default ProfilePage;
