import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, ListGroup, Spinner, Button, Modal, Form, Card, Stack,
} from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import CircleImage from '../components/ui/js/misc/CircleImage';

function UserProfilePage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [bio, setBio] = useState('');
  const [decodedPfp, setDecodedPfp] = useState('');
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isPlatformOwner, setIsPlatformOwner] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState('');

  const [isUserFound, setIsUserFound] = useState(false);

  const [isScreenSmall, setSmallScreen] = useState(window.innerWidth < 1024);

  const params = useParams();

  const navigate = useNavigate();
  const userId = params.id;

  const formatTimeSince = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp * 1000); // Convert UNIX epoch to JavaScript date object

    const diffInMinutes = Math.floor(diff / 1000 / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    return 'Just Now';
  };

  const navigateToPlatform = (e, id) => {
    if (e.target.localName === 'h3') navigate(`/platform/${id}`);
  };

  const navigateToCampaign = (e, id) => {
    if (e.target.localName === 'h3') navigate(`/campaign/${id}`);
  };

  // Open the new message modal
  /* const handleShowMessageModal = () => {
    setShowMessageModal(true);
  }; */

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
          const { account } = data;
          setFullName(account.full_name || 'N/A');
          setEmail(account.email);
          setPhone(account.phone || null);
          setLastLogin(formatTimeSince(
            account.last_login >= account.date_created ? account.last_login : account.date_created,
          )); // Some dummy data were generated incorrectly. Shouldn't be a problem for real users.
          setDateCreated(formatTimeSince(account.date_created));
          setBio(account.bio || 'No bio available.');
          setDecodedPfp(account.pfp);
          setIsPlatformOwner(account.platform_owner);
          if (account.platform_owner) {
            setPlatforms(data.platforms || []);
          } else {
            setCampaigns(data.campaigns || []);
          }
          setIsUserFound(true);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error fetching user data:', error);
          setIsUserFound(false);
        })
        .finally(() => {
          setLoading(false); // Set loading to false regardless of success or failure
        });
    }
  }, [userId]);

  useEffect(() => {
    document.title = `${fullName} - CraigsAdList`;
  }, [fullName]);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      }}
      >
        <Spinner animation="border" role="status" variant="secondary" />
      </div>
    );
  }

  if (!isUserFound) {
    document.title = '404 - CraigsAdList';
    return (
      <FadeIn>
        <div
          align="center"
          style={{ marginTop: '40vh' }}
        >
          <h1>404</h1>
          <l>This user cannot be found or does not exist.</l>
          <p>Please try again later.</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <Container className="mt-5">

      <div>
        <Col>
          <Row className="justify-content-center">
            <Col className="mb-5" md={8} alignItem="center">
              {/* Profile Picture */}
              <FadeIn>
                <CircleImage
                  src={decodedPfp}
                  alt="Profile"
                  size="large"
                  className="mb-3"
                />
                {/* Full Name */}
                <h2>{fullName}</h2>
                <Stack direction="horizontal" gap={3}>
                  <Col>
                    {/* Email */}
                    <p>
                      <Card.Subtitle className="text-muted">
                        Email:
                      </Card.Subtitle>
                      {' '}
                      {email}
                    </p>
                    {/* Phone number (if available) */}
                    {phone ? (
                      <p>
                        <Card.Subtitle className="text-muted">
                          Phone:
                        </Card.Subtitle>
                        {' '}
                        {phone}
                      </p>
                    ) : (
                      <p>
                        <Card.Subtitle className="text-muted">
                          Phone:
                        </Card.Subtitle>
                        {' Not Availible'}

                      </p>
                    ) }
                  </Col>
                  <Col>
                    {/* Last login */}
                    <p>
                      <Card.Subtitle className="text-muted">
                        Last login:
                      </Card.Subtitle>
                      {' '}
                      {lastLogin || 'Never logged in'}
                    </p>
                    {/* Date created */}
                    <p>
                      <Card.Subtitle className="text-muted">
                        Account created:
                      </Card.Subtitle>
                      {' '}
                      {dateCreated}
                    </p>
                  </Col>
                </Stack>
                {/* <Button variant="primary" onClick={handleShowMessageModal}>
                Send Message
              </Button> */}
              </FadeIn>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8}>
              <FadeIn>
                {/* Bio Section inside a Bootstrap Card */}
                <Card className="mb-4">
                  <Card.Header><h3>Bio</h3></Card.Header>
                  <Card.Body>
                    <Card.Text>{bio}</Card.Text>
                  </Card.Body>
                </Card>

                {/* Conditional List (Campaigns or Platforms) */}
                <div className="mb-4">
                  <Card.Header style={{ border: '1px solid rgba(0,0,0,.125)' }}><h3>{isPlatformOwner ? 'Platforms Owned' : 'Ad Campaigns'}</h3></Card.Header>
                  <ListGroup>
                    {isPlatformOwner
                      ? platforms.map((platform) => (
                        <ListGroup.Item
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => navigateToPlatform(e, platform.id)}
                          key={platform.id}
                        >
                          {!isScreenSmall && (
                          <Stack direction="horizontal" gap={5}>
                            <div>
                              <CircleImage
                                src={platform.pfp}
                                alt="Platform"
                                size="medium"
                                className="mb-3"
                              />
                            </div>
                            <div>
                              <h3>{platform.platformName}</h3>
                              <p>{platform.description}</p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Preferred Price Per Ad View:
                                </Card.Subtitle>
                                {` $${(platform.pricePerAdView / 10).toFixed(2)}`}
                              </p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Impressions(Per Month):
                                </Card.Subtitle>
                                {` ${platform.impressions.toLocaleString()}`}
                              </p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Topics:
                                </Card.Subtitle>
                                {` ${platform.topics}`}
                              </p>
                            </div>
                          </Stack>
                          )}
                          {isScreenSmall && (
                          <Stack gap={3}>
                            <div align="center">
                              <CircleImage
                                src={platform.pfp}
                                alt="Platform"
                                size="medium"
                                className="mb-3"
                              />
                            </div>
                            <h3>{platform.platformName}</h3>
                            <p>{platform.description}</p>
                            <p>
                              <Card.Subtitle className="text-muted">
                                Preferred Price Per Impression:
                              </Card.Subtitle>
                              {` $${(platform.pricePerAdView / 100).toFixed(2)}`}
                            </p>
                            <p>
                              <Card.Subtitle className="text-muted">
                                Impressions(Per Month):
                              </Card.Subtitle>
                              {` ${platform.impressions.toLocaleString()}`}
                            </p>
                            <p>
                              <Card.Subtitle className="text-muted">
                                Topics:
                              </Card.Subtitle>
                              {` ${platform.topics}`}
                            </p>
                          </Stack>
                          )}
                        </ListGroup.Item>
                      ))
                      : campaigns.map((campaign) => (
                        <ListGroup.Item
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => navigateToCampaign(e, campaign.id)}
                          key={campaign.id}
                        >
                          {!isScreenSmall && (
                          <Stack direction="horizontal" gap={5}>
                            <div>
                              <CircleImage
                                src={campaign.pfp}
                                alt="Campaign"
                                size="medium"
                                className="mb-3"
                              />
                            </div>
                            <div>
                              <h3>{campaign.title}</h3>
                              <p>{campaign.description}</p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Budget:
                                </Card.Subtitle>
                                {`$${campaign.budget.toLocaleString()}`}
                              </p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Topics:
                                </Card.Subtitle>
                                {campaign.topics}
                              </p>
                            </div>
                          </Stack>
                          )}
                          {isScreenSmall && (
                          <Stack gap={3}>
                            <div align="center">
                              <CircleImage
                                src={campaign.pfp}
                                alt="Campaign"
                                size="medium"
                                className="mb-3"
                              />
                            </div>
                            <div>
                              <h3>{campaign.title}</h3>
                              <p>{campaign.description}</p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Budget:
                                </Card.Subtitle>
                                {`$${campaign.budget.toLocaleString()}`}
                              </p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Topics:
                                </Card.Subtitle>
                                {campaign.topics}
                              </p>
                            </div>
                          </Stack>
                          )}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </div>
              </FadeIn>
            </Col>
          </Row>
        </Col>

        {/* New Message Modal */}
        <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
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

    </Container>
  );
}

export default UserProfilePage;
