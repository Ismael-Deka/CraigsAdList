import { Dropdown } from 'react-bootstrap';
import { useLocation } from 'react-router';

function MenuNavigation() {
  const location = useLocation();
  return (

    <div>
      <Dropdown.Item href="/">
        {location.pathname === '/' && <text>✓</text>}
        {' '}
        Landing Page

      </Dropdown.Item>
      <Dropdown.Item href="/ads">
        {location.pathname === '/ads' && <text>✓</text>}
        {' '}
        Find Ads

      </Dropdown.Item>
      <Dropdown.Item href="/channels">
        {location.pathname === '/channels' && <text>✓</text>}
        {' '}
        Find Channels

      </Dropdown.Item>

      <Dropdown.Item href="/new_channel">
        {location.pathname === '/new_channel' && <text>✓</text>}
        {' '}
        Create New Channel

      </Dropdown.Item>
      <Dropdown.Item href="/new_add">
        {location.pathname === '/new_add' && <text>✓</text>}
        {' '}
        Create New Ad

      </Dropdown.Item>

      <Dropdown.Item href="/new_response">
        {location.pathname === '/new_response' && <text>✓</text>}
        {' '}
        Respond to Offers

      </Dropdown.Item>
      <Dropdown.Item href="/new_offer">
        {location.pathname === '/new_offer' && <text>✓</text>}
        {' '}
        Create New Offer

      </Dropdown.Item>
      <Dropdown.Item href="/messages/inbox">
        {(/^\/messages.*/).test(location.pathname) && <text>✓</text>}
        {' '}
        Messages

      </Dropdown.Item>
    </div>
  );
}

export default MenuNavigation;
