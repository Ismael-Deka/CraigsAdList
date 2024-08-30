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
    console.log(pfp);
    const handleCardTitleResize = () => {
      if (infoCardTitleRef.current) {
        const infoCardTitle = infoCardTitleRef.current;
        setShowTooltip(infoCardTitle.offsetWidth < infoCardTitle.scrollWidth);
      }
    };

    const handleCardResize = () => {
      if (infoCardRef.current && cardWidth !== infoCardRef.current.clientWidth) {
        const infoCard = infoCardRef.current;
        setCardWidth(infoCard.clientWidth - 240);
      }
    };
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleCardResize();
    handleCardTitleResize();

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('resize', handleCardResize);
    window.addEventListener('resize', handleCardTitleResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('resize', handleCardResize);
      window.removeEventListener('resize', handleCardTitleResize);
    };
  }, [cardWidth]);

  const renderTooltip = ({ content, placement, delay }) => {
    if (showTooltip) {
      return (
        <Tooltip id="button-tooltip" placement={placement} delay={delay}>
          {content}
        </Tooltip>
      );
    }
    return <span />;
  };

  return (
    <Col>
      <Card ref={infoCardRef} style={isMobile ? { width: 'max-content' } : {}}>
        <Stack direction={isMobile ? 'vertical' : 'horizontal'}>
          {isMobile && (
            <Card.Img
              width={230}
              variant="top"
              src={pfp}
              alt={`${username}'s profile`}
            />
          )}
          {!isMobile && (
            <Card.Img
              width={230}
              variant="left"
              src={pfp}
              alt={`${username}'s profile`}
            />
          )}

          <Card.Body style={!isMobile ? { padding: '0', paddingLeft: '10px' } : {}}>
            <Card.Title onClick={navigateToUserProfile} style={{ cursor: 'pointer' }}>
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip({
                  content: username,
                  placement: 'top',
                  delay: { show: 250, hide: 400 },
                })}
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
        <Card.Footer>
          <small className="text-muted" style={{ float: 'right' }}>
            <a href={`/profile/${id}`}>View Profile</a>
          </small>
        </Card.Footer>
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
