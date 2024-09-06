import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import {
  Dropdown,
} from 'react-bootstrap';
import classes from '../../css/ProfileButton.module.css'; // Assuming you have some styles for the component
import CircleImage from '../misc/CircleImage';
import MenuNavigation from './MenuNavigation';

function ProfileButton({
  profileName, profilePictureUrl, isLoggedIn, logOut, id, isMobile,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const location = useLocation();
  useEffect(() => {}, [isLoggedIn]);

  return (
    <div
      className={classes.navbarItem}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {
        isLoggedIn
        && (
        <div className={`${classes.profileSection} font-weight-bold`}>
          <CircleImage src={profilePictureUrl} size="small" />
          {!isMobile && (
          <span>
            {profileName}
            <svg width="1em" height="1em" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow"><path d="M5.633 6.352L.775 1.089A.5.5 0 011.142.25h9.716a.5.5 0 01.367.84L6.367 6.351a.5.5 0 01-.734 0z" fill="#000000" /></svg>
          </span>
          )}
        </div>
        )
}
      {
        !isLoggedIn
        && (
          <div className={classes.profileSection}>
            <strong>Log-in</strong>
            <svg width="1em" height="1em" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow"><path d="M5.633 6.352L.775 1.089A.5.5 0 011.142.25h9.716a.5.5 0 01.367.84L6.367 6.351a.5.5 0 01-.734 0z" fill="#000000" /></svg>
          </div>
        )
      }
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
              <a href={`/profile/${id}`}>{profileName}</a>
            </Dropdown.ItemText>
            <Dropdown.Item href="/settings">
              {location.pathname === '/settings' && <text>✓</text>}
              {' '}
              <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#setting_svg__clip0)"><path d="M15.253 6.578c-.035-.285-.213-.534-.533-.605h-.036c-.64-.142-1.102-.498-1.457-1.102-.32-.533-.427-1.209-.214-1.813.107-.25.036-.57-.213-.783A6.674 6.674 0 0010.382.818C10.133.71 9.85.782 9.6 1.03c-.391.498-.996.747-1.671.747-.605 0-1.173-.285-1.671-.783-.285-.284-.57-.248-.782-.177-.925.39-1.707.853-2.383 1.422a.675.675 0 00-.249.782c.178.676.107 1.316-.213 1.885-.284.497-.818.888-1.458 1.066-.035 0-.035 0-.07.036-.214.106-.356.284-.463.533v.036a7.21 7.21 0 00-.142 1.457c0 .463.035.996.142 1.423.036.284.213.533.533.604h.036c.64.142 1.102.498 1.458 1.102.32.534.426 1.21.213 1.814-.107.249-.036.569.213.782a6.533 6.533 0 002.454 1.458c.035 0 .07.035.142.035h.107a.814.814 0 00.568-.249c.392-.462.996-.746 1.672-.746.604 0 1.173.284 1.67.782.143.142.32.249.498.249.072 0 .178 0 .25-.036.924-.39 1.706-.853 2.382-1.422.248-.142.355-.498.248-.782-.177-.676-.106-1.316.214-1.885.284-.497.818-.889 1.458-1.066.035 0 .035 0 .07-.036.214-.107.356-.284.463-.533v-.036c.107-.533.142-.995.142-1.458-.035-.497-.071-.995-.178-1.457zm-7.324 3.91A2.474 2.474 0 015.44 8 2.474 2.474 0 017.929 5.51 2.474 2.474 0 0110.418 8a2.474 2.474 0 01-2.49 2.489z" stroke="#8C8C8C" /></g>
                <defs><clipPath id="setting_svg__clip0"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs>
              </svg>
              {` ${'Settings'}`}

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
  isMobile: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
};

export default ProfileButton;
