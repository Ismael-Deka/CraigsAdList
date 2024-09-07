import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import SimpleListItem from '../../misc/SimpleListItem';

function UserItem(props) {
  const { user } = props;
  const {
    id, fullName, email, pfp,
  } = user;

  const navigate = useNavigate();
  const navigateToUserProfile = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <SimpleListItem
      name={fullName}
      metadata={email}
      pfp={pfp}
      navigateToUserProfile={navigateToUserProfile}
    />
  );
}

export default UserItem;

UserItem.defaultProps = {
  user: PropTypes.shape({
    id: 0,
    fullName: '',
    email: '',
    pfp: '',
  }),
};

UserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    pfp: PropTypes.string.isRequired, // Base64 string for profile picture
  }),
};
