import {
  Card, Col, Stack, Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import { useNavigate } from 'react-router';
import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

// import OfferModal from '../../misc/OfferModal';

import classes from '../../../css/ListItem.module.css';

function AdCampaignItem(props) {
  const { campaign } = props;
  const {
    id, ownerId, ownerName, campaignName, topics, budget,
  } = campaign;

  const navigate = useNavigate();
  const navigateToCampaignPage = () => {
    navigate(`/campaign/${id}`);
  };

  const infoCardRef = useRef(null);
  const infoCardTitleRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 475);
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
      setIsMobile(window.innerWidth < 475);
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
      <Card ref={infoCardRef} style={isMobile ? { width: '90vw' } : {}}>
        <Stack direction={isMobile ? 'vertical' : 'horizontal'}>
          {isMobile && (
            <Card.Img
              width={230}
              variant="top"
              src={campaign.pfp}
            />
          )}
          {!isMobile && (
            <Card.Img
              width={230}
              variant="left"
              src={campaign.pfp}
            />
          )}

          <Card.Body style={!isMobile ? { padding: '0', paddingLeft: '10px' } : {}}>
            <Card.Title onClick={navigateToCampaignPage} style={{ cursor: 'pointer' }}>
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip({
                  content: campaignName,
                  placement: 'top',
                  delay: { show: 250, hide: 400 },
                })}
              >
                <h4
                  ref={infoCardTitleRef}
                  className={classes.ellipsisText}
                  style={!isMobile ? { whiteSpace: 'nowrap', maxWidth: cardWidth } : {}}
                >
                  {campaignName.replace('_', ' ')}
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
                <b style={{ float: 'left' }}>
                  Budget: $
                  {budget}
                </b>
              </p>
            </Card.Text>
          </Card.Body>
        </Stack>
        <Card.Footer>
          {/* <OfferModal style={{ float: 'left' }} campaignId={campaign.id} /> */}
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

export default AdCampaignItem;

AdCampaignItem.defaultProps = {
  campaign: PropTypes.shape({
    id: 0,
    ownerId: 0,
    ownerName: '',
    campaignName: '',
    topics: '',
    budget: 0,
    pfp: '',
  }),
};

AdCampaignItem.propTypes = {
  campaign: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ownerId: PropTypes.number.isRequired,
    ownerName: PropTypes.string.isRequired,
    campaignName: PropTypes.string.isRequired,
    topics: PropTypes.string,
    budget: PropTypes.number,
    pfp: PropTypes.string,
  }),
};
