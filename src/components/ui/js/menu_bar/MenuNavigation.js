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

    </div>
  );
}

export default MenuNavigation;
