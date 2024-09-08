import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Button,
} from 'react-bootstrap';
import CalIcon from '../../../../images/cal_icon_muted.svg';
import classes from '../../css/HomeView.module.css';

function HomeView() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Container
        fluid="md"
        style={{
          paddingTop: '5%',
          paddingBottom: '10%',

        }}
      >
        <Row
          className={classes.borderView}
          style={!isMobile ? {
            backgroundImage: `url(${CalIcon})`,
          } : {
            backgroundImage: `url(${CalIcon})`,
            backgroundSize: 'contain',
          }}
        >
          <Col style={{ paddingLeft: '5vw', paddingTop: '15vh', paddingBottom: '15vh' }}>
            <Row xs={1} className="pl-2  mt-5">
              <h1 className="display-3">Welcome to CraigsAdList!</h1>
            </Row>
            <Row xs={1} className="pl-2 mb-2">
              <p className="lead">
                Discover platforms, ad campaigns, and more.
              </p>
            </Row>
            <Button className="pl-2" variant="secondary" href="/search/platforms">Explore Platforms</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomeView;
