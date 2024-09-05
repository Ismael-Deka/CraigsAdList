import {
  Card, Col, Stack, Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import { useNavigate } from 'react-router';
import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import OfferModal from '../../misc/OfferModal';

import classes from '../../../css/ListItem.module.css';
// import CircleImage from '../CircleImage';

function PlatformItem(props) {
  const { platform } = props;
  const {
    id, ownerId, ownerName, platformName, impressions, topics, preferredPrice,
  } = platform;

  const navigate = useNavigate();
  const navigateToPlatformPage = () => {
    navigate(`/platform/${id}`);
  };

  const infoCardRef = useRef(null);
  const infoCardTitleRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTooltip, setShowTooltip] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const handleCardTitleResize = () => {
      if (infoCardTitleRef.current) {
        const infoCardTitle = infoCardTitleRef.current;
        setShowTooltip(infoCardTitle.offsetWidth < infoCardTitle.scrollWidth);
      }
    };

    const handleCardResize = () => {
      if (infoCardRef.current && cardWidth !== infoCardRef.current.clientWidth) {
        const infoCard = infoCardRef.current;
        setCardWidth(infoCard.clientWidth);
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
  }, []);

  const renderTooltip = ({ content, placement, delay }) => {
    if (showTooltip) {
      return (
        <Tooltip id="button-tooltip" placement={placement} delay={delay}>
          {content}
        </Tooltip>
      );
    }
    return (<span />);
  };

  return (
    <Col>
      <Card ref={infoCardRef} style={(isMobile) ? { width: 'max-content' } : {}}>
        <Stack direction={(!isMobile) ? ('horizontal') : ('vertical')}>
          {isMobile && (<Card.Img width={230} variant="top" src={platform.pfp} />)}
          {!isMobile && (<Card.Img width={230} variant="left" src={platform.pfp} />)}

          <Card.Body style={(!isMobile) ? { padding: '0', paddingLeft: '10px' } : {}}>
            <Card.Title onClick={navigateToPlatformPage} style={{ cursor: 'pointer' }}>
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <h4 ref={infoCardTitleRef} className={classes.ellipsisText} style={(!isMobile) ? { whiteSpace: 'nowrap', maxWidth: cardWidth } : {}}>
                  {platformName.replace('_', ' ')}
                </h4>
              </OverlayTrigger>
            </Card.Title>
            <Card.Text>
              <p className={classes.ellipsisText}>
                Topics:
                <br />
                {topics}
              </p>

              <p>
                Impressions:
                <br />
                {impressions.toLocaleString()}
              </p>

              <p>
                <b style={{ float: 'left' }}>
                  Preferred Price: $
                  {preferredPrice}
                </b>

              </p>

            </Card.Text>
          </Card.Body>

        </Stack>
        <Card.Footer>

          <OfferModal style={{ float: 'left' }} platformId={platform.id} />

          <small className="text-muted" style={{ float: 'right' }}>
            by
            {' '}
            <a href={`/profile/${ownerId}`}>{ownerName}</a>
          </small>
        </Card.Footer>
      </Card>
    </Col>
  );
}

export default PlatformItem;

PlatformItem.defaultProps = {
  platform: PropTypes.shape({
    id: 0,
    ownerId: 0,
    ownerName: '',
    platformName: '',
    impressions: 0,
    topics: '',
    preferredPrice: 0,
    pfp: '',
  }),

};
PlatformItem.propTypes = {
  platform: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ownerId: PropTypes.number.isRequired,
    ownerName: PropTypes.string.isRequired,
    platformName: PropTypes.string.isRequired,
    impressions: PropTypes.number.isRequired,
    topics: PropTypes.string,
    preferredPrice: PropTypes.number,
    pfp: PropTypes.string,
  }),

};
