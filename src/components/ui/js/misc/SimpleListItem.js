import React, { useRef, useEffect, useState } from 'react';
import {
  Card, Stack, Tooltip, OverlayTrigger, Col,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import classes from '../../css/ListItem.module.css';

function SimpleListItem({
  name, metadata, pfp, navigateToUserProfile,
}) {
  const infoCardRef = useRef(null);
  const infoCardTitleRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
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
      <Card onClick={navigateToUserProfile} ref={infoCardRef}>
        <Stack className="p-1" direction="horizontal">
          <Card.Img
            variant="left"
            src={pfp}
            alt={`${name}'s profile`}
            className={classes.fixedImage}
          />

          <Card.Body className={classes.horizontalPadding}>
            <Card.Title style={{ cursor: 'pointer' }}>
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={showTooltip ? (
                  <Tooltip id="button-tooltip">
                    {name}
                  </Tooltip>
                ) : <span />}
              >
                <h4
                  ref={infoCardTitleRef}
                  className={classes.ellipsisText}
                  style={{ whiteSpace: 'nowrap', maxWidth: cardWidth - 132 }} // compensate for pfp size(rendered size 100px) and padding(32px)
                >
                  {name}
                </h4>
              </OverlayTrigger>
            </Card.Title>
            <Card.Text>
              <p className={classes.ellipsisText}>
                {metadata}
              </p>
            </Card.Text>
          </Card.Body>
        </Stack>
      </Card>
    </Col>
  );
}

SimpleListItem.defaultProps = {
  navigateToUserProfile: () => {},
};

SimpleListItem.propTypes = {
  name: PropTypes.string.isRequired,
  metadata: PropTypes.string.isRequired,
  pfp: PropTypes.string.isRequired,
  navigateToUserProfile: PropTypes.func,
};

export default SimpleListItem;
