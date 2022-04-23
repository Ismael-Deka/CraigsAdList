// Should probably enable later, for now it is just useless
import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from 'react-router';
import background from '../images/background.webp';
import picardia from '../images/picardia.png';
import picardiaMirrored from '../images/picardiaMirrored.png';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundImage: `url(${background})`, height: '100vh' }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto"><h1><Badge pill bg="light" text="dark">CraigsAdList</Badge></h1></Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <img src={picardia} alt="picardia" width={200} height={150} />
          </Col>
          <Col md="auto"><h2><Badge pill bg="light" text="dark">Ultimate solution for advertisement in Telegram</Badge></h2></Col>
          <Col md="auto">
            <img src={picardiaMirrored} alt="picardiaMirrored" width={200} height={150} />
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto"><h3><Button size="lg" variant="primary" onClick={() => navigate('/ads')}>Explore channels</Button></h3></Col>
          <Col md="auto">
            <h3><Badge pill bg="light" text="dark">Find space for your ads or offer ad`s space on your channel</Badge></h3>
          </Col>
          <Col md="auto"><h3><Button size="lg" variant="primary" onClick={() => navigate('/channels')}>Explore ads</Button></h3></Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto"><h3><Button size="lg" variant="primary" onClick={() => navigate('/signup')}>Create account</Button></h3></Col>
        </Row>
      </Container>
      <div style={{
        position: 'absolute',
        bottom: 0,
        textAlign: 'center',
      }}
      >
        <b>Made by: Ismael Deka, Subhash Tanikella, Pavel Popov, Utsav Patel (2022)</b>
      </div>
    </div>
  );
}

export default LandingPage;
