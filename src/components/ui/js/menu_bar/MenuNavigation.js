import { Dropdown } from 'react-bootstrap';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

function MenuNavigation({ isPlatformOwner }) {
  const location = useLocation();
  return (

    <div>
      <Dropdown.Item href="/">
        {location.pathname === '/' && <text>✓</text>}
        {' '}
        Landing Page

      </Dropdown.Item>
      <Dropdown.Item href="/search/platforms">
        {location.pathname.startsWith('/search/platforms') && <text>✓</text>}
        {' '}
        Find Platforms

      </Dropdown.Item>
      <Dropdown.Item href="/search/campaigns">
        {location.pathname.startsWith('/search/campaigns') && <text>✓</text>}
        {' '}
        Find Ad Campaigns

      </Dropdown.Item>

      <Dropdown.Item href="/search/users">
        {location.pathname.startsWith('/search/users') && <text>✓</text>}
        {' '}
        Find Users

      </Dropdown.Item>

      {isPlatformOwner && (
      <Dropdown.Item href="/new_platform">
        {location.pathname.startsWith('/new_platform') && <text>✓</text>}
        {' '}
        Create New Platform

      </Dropdown.Item>
      )}
      {!isPlatformOwner && (
      <Dropdown.Item href="/new_campaign">
        {location.pathname.startsWith('/new_campaign') && <text>✓</text>}
        {' '}
        Create New Campaign

      </Dropdown.Item>
      )}

    </div>
  );
}
MenuNavigation.propTypes = {
  isPlatformOwner: PropTypes.bool.isRequired,
};

export default MenuNavigation;
