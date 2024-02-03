// Import necessary React and Bootstrap components
import React, { useState } from 'react';
import {
  Form, Button, Container, Row, Col,
} from 'react-bootstrap';

// Functional component for the NewPlatformPage
function NewPlatformPage() {
  // State variables for form inputs

  const hoursAndHalfHours = [];
  for (let hour = 1; hour <= 12; hour += 1) {
    hoursAndHalfHours.push(`${hour}:00`);
    hoursAndHalfHours.push(`${hour}:30`);
  }

  const [name, setName] = useState('');
  const [medium, setMedium] = useState('Online');
  const [url, setUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [channelName, setChannelName] = useState('');
  const [showName, setShowName] = useState('');
  const [hour, setHour] = useState('');
  const [ampm, setAmpm] = useState('AM');
  const [publisher, setPublisher] = useState('');
  const [releaseSchedule, setReleaseSchedule] = useState('');
  const [radioFrequency, setRadioFrequency] = useState('');
  const [amOrFm, setAmOrFm] = useState('AM');
  const [outdoorMediaType, setOutdoorMediaType] = useState('');
  const [location, setLocation] = useState('');
  const [billingOption, setBillingOption] = useState('');
  const [subscribersFollowers, setSubscribersFollowers] = useState('');
  const [dailyActiveUsers, setDailyActiveUsers] = useState('');
  const [userDemographics, setUserDemographics] = useState('');
  const [targetingOptions, setTargetingOptions] = useState('');
  const [billingInfo, setBillingInfo] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform actions with form data, e.g., send to server
    const formData = {
      name,
      medium,
      url,
      mediaType,
      channelName,
      showName,
      timeslot: { hour, ampm },
      publisher,
      releaseSchedule,
      radioFrequency,
      amOrFm,
      outdoorMediaType,
      location,
      subscribersFollowers,
      dailyActiveUsers,
      userDemographics,
      targetingOptions,
      billingInfo,
    };
    console.log(formData);
    // You can add additional logic here to handle form data as needed
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={12} className="mt-5">
          <h2>Add New Platform</h2>
          <hr className="hr hr-blurry mb-5" />
          <Row className="mt-5">
            <Col md={{ span: 10, offset: 1 }}>
              <h4 className="mt-2">Basic Information</h4>
              <hr className="hr hr-blurry" />
              <Form onSubmit={handleSubmit}>
                <div className="col-md-9 offset-md-1 mb-5">
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      name="name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formMedium">
                    <Form.Label>Medium</Form.Label>
                    <Form.Control
                      style={{ appearance: 'auto' }}
                      as="select"
                      name="medium"
                      defaultValue="Online"
                      value={medium}
                      onChange={
                        (e) => { setMedium(e.target.value); }
                      }
                      required
                    >

                      <option value="Online">Online</option>
                      <option value="TV">TV</option>
                      <option value="Print">Print</option>
                      <option value="Radio">Radio</option>
                      <option value="Outdoor">Outdoor</option>
                    </Form.Control>
                  </Form.Group>

                  {medium === 'Online' && (
                  <>
                    <Form.Group className="mb-3" controlId="formUrl">
                      <Form.Label>URL</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="Enter URL"
                        name="url"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); }}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMediaType">
                      <Form.Label>Type of Media</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter type of media (Video, Blog, Newsletter, Podcast, etc.)"
                        name="mediaType"
                        value={mediaType}
                        onChange={(e) => { setMediaType(e.target.value); }}
                        required
                      />
                    </Form.Group>
                  </>
                  )}

                  {medium === 'TV' && (
                  <>
                    <Form.Group className="mb-3" controlId="formChannelName">
                      <Form.Label>Channel Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter channel name"
                        name="channelName"
                        value={channelName}
                        onChange={(e) => { setChannelName(e.target.value); }}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formShowName">
                      <Form.Label>Show Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter show name"
                        name="showName"
                        value={showName}
                        onChange={(e) => { setShowName(e.target.value); }}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTimeslot">
                      <Form.Label>Timeslot</Form.Label>
                      <Row>
                        <Col>
                          <Form.Control
                            as="select"
                            name="hour"
                            value={hour}
                            onChange={(e) => { setHour(e.target.value); }}
                            required
                            style={{ appearance: 'auto' }}
                          >
                            {hoursAndHalfHours.map(
                              (value, index) => (
                                <option id={index} value={value}>{value}</option>
                              ),
                            )}

                            {/* Add options for hours */}
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control
                            style={{ appearance: 'auto' }}
                            as="select"
                            name="ampm"
                            value={ampm}
                            onChange={(e) => { setAmpm(e.target.value); }}
                            required
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </Form.Control>
                        </Col>
                      </Row>
                    </Form.Group>
                  </>
                  )}

                  {medium === 'Print' && (
                  <>
                    <Form.Group className="mb-3" controlId="formPublisher">
                      <Form.Label>Publisher</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter publisher"
                        name="publisher"
                        value={publisher}
                        onChange={(e) => { setPublisher(e.target.value); }}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formReleaseSchedule">
                      <Form.Label>Release Schedule</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter release schedule"
                        name="releaseSchedule"
                        value={releaseSchedule}
                        onChange={(e) => { setReleaseSchedule(e.target.value); }}
                        required
                      />
                    </Form.Group>
                  </>
                  )}

                  {medium === 'Radio' && (
                    <>
                      <Form.Group className="mb-3" controlId="formRadioFrequency">
                        <Form.Label>Radio Frequency</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter radio frequency"
                          name="radioFrequency"
                          value={radioFrequency}
                          onChange={(e) => setRadioFrequency(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formAmOrFm">
                        <Form.Label>AM or FM</Form.Label>
                        <Form.Control
                          style={{ appearance: 'auto' }}
                          as="select"
                          name="amOrFm"
                          value={amOrFm}
                          onChange={(e) => setAmOrFm(e.target.value)}
                          required
                        >
                          <option value="AM">AM</option>
                          <option value="FM">FM</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formTimeslot">
                        <Form.Label>Timeslot</Form.Label>
                        <Row>
                          <Col>
                            <Form.Control
                              as="select"
                              name="hour"
                              value={hour}
                              onChange={(e) => setHour(e.target.value)}
                              required
                              style={{ appearance: 'auto' }}
                            >
                              {hoursAndHalfHours.map(
                                (value, index) => (
                                  <option id={index} value={value}>{value}</option>
                                ),
                              )}
                              {/* Add options for hours */}
                            </Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ appearance: 'auto' }}
                              as="select"
                              name="ampm"
                              value={ampm}
                              onChange={(e) => setAmpm(e.target.value)}
                              required
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </Form.Control>
                          </Col>
                        </Row>
                      </Form.Group>
                    </>
                  )}

                  {medium === 'Outdoor' && (
                    <>
                      <Form.Group className="mb-3" controlId="formOutdoorMediaType">
                        <Form.Label>Type of Media</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter type of media (Billboard, LCD screen, Storefront, Flyers, etc.)"
                          name="outdoorMediaType"
                          value={outdoorMediaType}
                          onChange={(e) => setOutdoorMediaType(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter location"
                          name="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </>
                  )}
                </div>

                <h4 className="mt-5">Platform Statistics</h4>
                <hr className="hr hr-blurry" />
                <div className="col-md-9 offset-md-1 mb-5">
                  <Form.Group className="mb-3" controlId="formSubscribersFollowers">
                    <Form.Label>Subscribers/Followers</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter subscribers/followers (optional)"
                      name="subscribersFollowers"
                      value={subscribersFollowers}
                      onChange={(e) => setSubscribersFollowers(e.target.value)}
                    />
                  </Form.Group>

                  {/* ... (Continue with other form fields) */}

                  <Form.Group className="mb-3" controlId="formDailyActiveUsers">
                    <Form.Label>Daily Active Users</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter daily active users (optional)"
                      name="dailyActiveUsers"
                      value={dailyActiveUsers}
                      onChange={(e) => setDailyActiveUsers(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formUserDemographics">
                    <Form.Label>User Demographics</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter user demographics"
                      name="userDemographics"
                      value={userDemographics}
                      onChange={(e) => setUserDemographics(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formTargetingOptions">
                    <Form.Label>Targeting Options</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter targeting options"
                      name="targetingOptions"
                      value={targetingOptions}
                      onChange={(e) => setTargetingOptions(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBillingInfo">
                    <Form.Label>Billing Info (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter billing info"
                      name="billingInfo"
                      value={billingInfo}
                      onChange={(e) => setBillingInfo(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBillingOption">
                    <Form.Label>Billing Option</Form.Label>
                    <Form.Control
                      style={{ appearance: 'auto' }}
                      as="select"
                      name="billingOption"
                      value={billingOption}
                      onChange={(e) => setBillingOption(e.target.value)}
                      required
                    >
                      <option value="">Select Billing Option</option>
                      <option value="CPM">Cost Per Mille (CPM)</option>
                      <option value="CPC">Cost Per Click (CPC)</option>
                      <option value="CPA">Cost Per Acquisition (CPA)</option>
                      <option value="CPV">Cost Per View (CPV)</option>
                      <option value="FlatFee">Flat Fee/Fixed Rate</option>
                      <option value="RevenueShare">Revenue Share</option>
                      <option value="Hybrid">Hybrid Model</option>
                      <option value="Bid">Bidding Model</option>
                      {/* Add other billing options as needed */}
                    </Form.Control>
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
    </Container>
  );
}

export default NewPlatformPage;
