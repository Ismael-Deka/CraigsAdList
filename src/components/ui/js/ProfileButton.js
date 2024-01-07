import React, { useState } from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import {
  Dropdown,
} from 'react-bootstrap';
import classes from '../css/ProfileButton.module.css'; // Assuming you have some styles for the component
import CircleImage from './CircleImage';
import MenuNavigation from './MenuNavigation';

function ProfileButton({
  profileName, profilePictureUrl, isLoggedIn, logOut,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const location = useLocation();

  return (
    <div
      className={classes.navbarItem}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classes.profileSection}>
        <CircleImage src={profilePictureUrl} size="small" />
        {profileName}
        <svg width="1em" height="1em" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow"><path d="M5.633 6.352L.775 1.089A.5.5 0 011.142.25h9.716a.5.5 0 01.367.84L6.367 6.351a.5.5 0 01-.734 0z" fill="#000000" /></svg>
      </div>
      {dropdownVisible && (
        <div className={classes.dropdownMenu}>
          {!isLoggedIn && (
          <div>
            <Dropdown.Item>Not Logged In</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/login">Log In</Dropdown.Item>
            <Dropdown.Item href="/signup">Sign Up</Dropdown.Item>
          </div>
          )}
          {isLoggedIn && (
          <div>

            <MenuNavigation />
            <Dropdown.Divider />

            <Dropdown.ItemText>
              Signed in as:
              {' '}
              <a href="/acount">{profileName}</a>
            </Dropdown.ItemText>
            <Dropdown.Item href="/acount">
              {location.pathname === '/acount' && <text>✓</text>}
              {' '}
              My Account

            </Dropdown.Item>

            <Dropdown.Item onClick={logOut}>Log out</Dropdown.Item>
          </div>
          )}
        </div>
      )}
    </div>
  );
}

ProfileButton.propTypes = {
  profileName: PropTypes.string.isRequired,
  profilePictureUrl: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
};

export default ProfileButton;
