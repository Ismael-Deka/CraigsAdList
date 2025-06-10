import React, { useState, useEffect } from 'react';
import {
  Form, Button, Container, Row, Col, Modal,
} from 'react-bootstrap';
import ImageSelectForm from '../components/ui/js/misc/ImageSelectForm';
import DefaultCampaignPic from '../images/campaign_default.svg';

function NewCampaignPage() {
  // State variables for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showInList, setShowInList] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [profilePic, setProfilePic] = useState(DefaultCampaignPic);
  const [validated, setValidated] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const convertToUnixTime = (dateString) => {
    // Create a new Date object from the yyyy-mm-dd string
    const date = new Date(dateString);

    // Get the Unix timestamp in milliseconds and convert it to seconds
    const unixTime = Math.floor(date.getTime() / 1000);

    return unixTime;
  };

  // Function to handle form submission with validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('topics', topics);
      formData.append('budget', budget);
      formData.append('currency', currency);
      formData.append('show_in_list', showInList);
      formData.append('is_active', isActive);
      formData.append('start_date', convertToUnixTime(startDate));
      formData.append('end_date', convertToUnixTime(endDate));
      formData.append('is_new_pfp_selected', profilePic === DefaultCampaignPic);
      if (profilePic !== DefaultCampaignPic) formData.append('pfp', profilePic);

      try {
        const response = await fetch('/create_campaign', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setModalMessage('Campaign created successfully!');
          setIsSuccess(true);
        } else {
          setModalMessage('Failed to create campaign. Please try again.');
          setIsSuccess(false);
        }
      } catch (error) {
        setModalMessage('An error occurred. Please try again later.');
        setIsSuccess(false);
      } finally {
        setShowModal(true);
      }
    }

    setValidated(true);
  };

  useEffect(() => {
    document.title = 'Create A New Campaign';
  }, []);

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    if (isSuccess) {
      // You can redirect or reset the form after success if necessary
      window.location.reload(); // Example: reload the page after success
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={12} className="mt-5">
          <h2>Create A New Campaign</h2>
          <hr className="hr hr-blurry mb-5" />
          <Row className="mt-5">
            <Col md={{ span: 10, offset: 1 }}>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <h4 className="mt-2">Choose Campaign Image</h4>
                <hr className="hr hr-blurry" />
                <ImageSelectForm
                  currentProfilePic={profilePic}
                  setProfilePic={setProfilePic}
                />
                <h4 className="mt-2">Campaign Information</h4>
                <hr className="hr hr-blurry" />
                <div className="col-md-9 offset-md-1 mb-5">
                  {/* Campaign Title */}
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Campaign Title</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter campaign title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a campaign title.
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a description.
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Topics */}
                  <Form.Group className="mb-3" controlId="formTopics">
                    <Form.Label>Topics</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter topics (comma-separated)"
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide topics.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <h4 className="mt-2">Budget and Dates</h4>
                <hr className="hr hr-blurry" />
                <div className="col-md-9 offset-md-1 mb-5">
                  {/* Budget */}
                  <Form.Group className="mb-3" controlId="formBudget">
                    <Form.Label>Budget (in dollars)</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      placeholder="Enter budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </Form.Group>

                  {/* Currency */}
                  <Form.Group className="mb-3" controlId="formCurrency">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control
                      required
                      disabled
                      type="text"
                      placeholder="Enter currency (e.g., USD)"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid currency.
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Start Date */}
                  <Form.Group className="mb-3" controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>

                  {/* End Date */}
                  <Form.Group className="mb-3" controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </div>

                <h4 className="mt-2">Visibility and Status</h4>
                <hr className="hr hr-blurry" />
                <div className="col-md-9 offset-md-1 mb-5">
                  {/* Show In List */}
                  <Form.Group className="mb-3" controlId="formShowInList">
                    <Form.Check
                      type="checkbox"
                      label="Show in list"
                      checked={showInList}
                      onChange={(e) => setShowInList(e.target.checked)}
                    />
                  </Form.Group>

                  {/* Is Active */}
                  <Form.Group className="mb-3" controlId="formIsActive">
                    <Form.Check
                      type="checkbox"
                      label="Is active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Success/Failure Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isSuccess ? 'Success' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default NewCampaignPage;
