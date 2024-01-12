import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Row, Col, Image, ListGroup,
} from 'react-bootstrap';

function ProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [decodedPfp, setDecodedPfp] = useState('');
  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    if (userId) {
      fetch(`/get_profile?id=${userId}`, { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUsername(data.username);
            setEmail(data.email);
            const decodedImage = data.pfp;
            setDecodedPfp(decodedImage);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error fetching user profile:', error);
        });
    }
  }, [userId]);
  return (
    <Container className="mt-5">
      <Row>
        <Col md={4}>
          {/* Profile Picture */}
          <Image
            src={decodedPfp}
            alt="Profile"
            fluid
            roundedCircle
            className="mb-3"
          />
          {/* Username */}
          <h2>{username}</h2>
          {/* Email */}
          <p>
            Email:
            {` ${email}`}
          </p>
        </Col>
        <Col md={8}>
          {/* Platforms Owned */}
          <div className="mb-4">
            <h3>Platforms Owned</h3>
            <ListGroup>
              <ListGroup.Item>Platform 1</ListGroup.Item>
              <ListGroup.Item>Platform 2</ListGroup.Item>
              {/* Add more platforms as needed */}
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
    </Container>
  );
}

export default ProfilePage;
