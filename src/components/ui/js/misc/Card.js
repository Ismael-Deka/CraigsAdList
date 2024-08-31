import PropTypes from 'prop-types';
import classes from '../../css/Card.module.css';

function Card({ children }) {
  return (
    <div className={classes.adscard}>
      {children}
    </div>
  );
}

export default Card;

Card.propTypes = {
  children: PropTypes.element.isRequired,

};
