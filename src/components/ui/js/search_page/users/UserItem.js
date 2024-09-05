import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import SimpleListItem from '../../misc/SimpleListItem';

function UserItem(props) {
  const { user } = props;
  const {
    id, username, email, pfp,
  } = user;

  const navigate = useNavigate();
  const navigateToUserProfile = () => {
    navigate(`/profile/${id}`);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <SimpleListItem
      name={username}
      metadata={email}
      pfp={pfp}
      isMobile={isMobile}
      navigateToUserProfile={navigateToUserProfile}
    />
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
