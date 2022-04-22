import { Dropdown } from 'react-bootstrap';
import { useLocation } from 'react-router';

function MenuNavigation() {
  const location = useLocation();
  return (

    <div>
      <Dropdown.Item href="/">
        {location.pathname === '/' && <text>✓</text>}
        {' '}
        Go to LandingPage

      </Dropdown.Item>
      <Dropdown.Item href="/ads">
        {location.pathname === '/ads' && <text>✓</text>}
        {' '}
        Go to AdsPage

      </Dropdown.Item>
      <Dropdown.Item href="/channels">
        {location.pathname === '/channels' && <text>✓</text>}
        {' '}
        Go to ChannelsPage

      </Dropdown.Item>
      <Dropdown.Item href="/acount">
        {location.pathname === '/acount' && <text>✓</text>}
        {' '}
        Go to UserAccountPage

      </Dropdown.Item>
      <Dropdown.Item href="/new_channel">
        {location.pathname === '/new_channel' && <text>✓</text>}
        {' '}
        New Channels

      </Dropdown.Item>
      <Dropdown.Item href="/new_add">
        {location.pathname === '/new_add' && <text>✓</text>}
        {' '}
        My Ads

      </Dropdown.Item>

      <Dropdown.Item href="/new_response">
        {location.pathname === '/new_response' && <text>✓</text>}
        {' '}
        Go to NewResponsePage

      </Dropdown.Item>
      <Dropdown.Item href="/new_offer">
        {location.pathname === '/new_offer' && <text>✓</text>}
        {' '}
        Go to NewOfferPage

      </Dropdown.Item>
    </div>
  );
}

export default MenuNavigation;
