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

  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);

  const [isUserFound, setIsUserFound] = useState(false);

  const [isScreenSmall, setSmallScreen] = useState(window.innerWidth < 1024);

  // New state for editing the bio

  const [isEditingBio, setIsEditingBio] = useState(false);

  const [tempBio, setTempBio] = useState('');

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
          setIsCurrentUserProfile(account.id === account.current_user_id);
          setFullName(account.full_name || 'N/A');
          setEmail(account.email);
          setPhone(account.phone || null);
          setLastLogin(formatTimeSince(
            account.last_login >= account.date_created ? account.last_login : account.date_created,
          )); // Some dummy data were generated incorrectly. Shouldn't be a problem for real users.
          setDateCreated(formatTimeSince(account.date_created));
          setBio(account.bio || 'No bio available.');
          setTempBio(account.bio || 'No bio available.'); // Set temp bio for editing
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
  }, [userId, bio]);

  useEffect(() => {
    document.title = `${fullName} - CraigsAdList`;
  }, [fullName]);

  // Handle edit/save bio

  const handleBioEdit = () => {
    setIsEditingBio(!isEditingBio); // Enable edit mode
  };

  const handleSaveBio = () => {
    // Send the new bio to the backend via a POST request
    fetch('/edit_bio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newBio: tempBio, // Pass the updated bio
      }),
    })
      .then((response) => {
        if (response.ok) {
          // If the request is successful, update the local state
          setBio(tempBio);
          setIsEditingBio(false);
        } else if (response.status === 400) {
          // Handle validation error (e.g., missing 'newBio')
          throw new Error("Validation error: Missing 'newBio' field");
        } else if (response.status === 401) {
          // Handle unauthorized error
          throw new Error('You are not authorized to edit this bio.');
        } else if (response.status === 404) {
          // Handle user not found error
          throw new Error('User not found.');
        } else {
          // Handle other potential errors
          throw new Error('An unexpected error occurred.');
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error saving bio:', error);
      });
  };

  const handleCancelBioEdit = () => {
    setTempBio(bio); // Reset the temp bio to the original value

    setIsEditingBio(false); // Exit edit mode
  };

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
                  <Card.Header>
                    <Stack direction="horizontal" gap={1}>
                      <h3>Bio</h3>
                      {/* Pencil Icon to toggle bio edit mode */}

                      {isCurrentUserProfile && (
                      <Button
                        variant="light"
                        onClick={handleBioEdit}
                        style={{
                          border: 'none', padding: '0', marginLeft: '10px', marginBottom: '5px',
                        }}
                      >

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">

                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />

                        </svg>

                      </Button>
                      )}

                    </Stack>
                  </Card.Header>
                  <Card.Body>
                    {isEditingBio ? (

                      <>

                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={tempBio !== 'No bio available.' ? tempBio : ''}
                          onChange={(e) => setTempBio(e.target.value)}
                        />

                        <Button variant="success" className="mt-2" onClick={handleSaveBio}>Save</Button>

                        <Button variant="secondary" className="mt-2 ms-2" onClick={handleCancelBioEdit}>Cancel</Button>

                      </>

                    ) : (

                      <Card.Text>{bio}</Card.Text>
                    )}
                  </Card.Body>
                </Card>

                {/* Conditional List (Campaigns or Platforms) */}
                <div className="mb-4">
                  {((isPlatformOwner && platforms.length > 0) || (!isPlatformOwner && campaigns.length > 0)) && (<Card.Header style={{ border: '1px solid rgba(0,0,0,.125)' }}><h3>{isPlatformOwner ? 'Platforms Owned' : 'Ad Campaigns'}</h3></Card.Header>)}
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
                                  {`$${(platform.pricePerAdView / 10).toFixed(2)}`}
                                </p>
                                <p>
                                  <Card.Subtitle className="text-muted">
                                    Impressions(Per Month):
                                  </Card.Subtitle>
                                  {`${platform.impressions.toLocaleString()}`}
                                </p>
                                <p>
                                  <Card.Subtitle className="text-muted">
                                    Topics:
                                  </Card.Subtitle>
                                  {`${platform.topics}`}
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
                                {`$${(platform.pricePerAdView / 100).toFixed(2)}`}
                              </p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Impressions(Per Month):
                                </Card.Subtitle>
                                {`${platform.impressions.toLocaleString()}`}
                              </p>
                              <p>
                                <Card.Subtitle className="text-muted">
                                  Topics:
                                </Card.Subtitle>
                                {`${platform.topics}`}
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
