import {
  Card, Col, Stack, Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import { useNavigate } from 'react-router';
import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import classes from '../../../css/ListItem.module.css';

function UserItem(props) {
  const { user } = props;
  const {
    id, username, email, pfp,
  } = user;

  const navigate = useNavigate();
  const navigateToUserProfile = () => {
    navigate(`/profile/${id}`);
  };

  const infoCardRef = useRef(null);
  const infoCardTitleRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTooltip, setShowTooltip] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      if (infoCardRef.current) {
        const infoCard = infoCardRef.current;
        setCardWidth(infoCard.clientWidth);
      }

      if (infoCardTitleRef.current) {
        const infoCardTitle = infoCardTitleRef.current;
        setShowTooltip(infoCardTitle.offsetWidth < infoCardTitle.scrollWidth);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Col>
      <Card onClick={navigateToUserProfile} ref={infoCardRef} style={isMobile ? { width: 'max-content' } : {}}>
        <Stack className="p-1" direction="horizontal">
          <Card.Img
            variant={isMobile ? 'top' : 'left'}
            src={pfp}
            alt={`${username}'s profile`}
            className={classes.fixedImage}
          />

          <Card.Body className={!isMobile ? classes.horizontalPadding : ''}>
            <Card.Title style={{ cursor: 'pointer' }}>
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={showTooltip ? (
                  <Tooltip id="button-tooltip">
                    {username}
                  </Tooltip>
                ) : <span />}
              >
                <h4
                  ref={infoCardTitleRef}
                  className={classes.ellipsisText}
                  style={!isMobile ? { whiteSpace: 'nowrap', maxWidth: cardWidth } : {}}
                >
                  {username}
                </h4>
              </OverlayTrigger>
            </Card.Title>
            <Card.Text>
              <p className={classes.ellipsisText}>
                Email:
                <br />
                {email}
              </p>
            </Card.Text>
          </Card.Body>
        </Stack>
      </Card>
    </Col>
  );
}

export default UserItem;

UserItem.defaultProps = {
  user: PropTypes.shape({
    id: 0,
    username: '',
    email: '',
    pfp: '',
  }),
};

UserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    pfp: PropTypes.string.isRequired, // Base64 string for profile picture
  }),
};
