import React from 'react';
import PropTypes from 'prop-types';
import classes from '../../css/CircleImage.module.css';

function CircleImage({ src, alt, size }) {
  if (size === 'small') {
    return (
      <img src={src} alt={alt} className={`${classes.circleImage} ${classes.small}`} />
    );
  } if (size === 'medium') {
    return (
      <img src={src} alt={alt} className={`${classes.circleImage} ${classes.medium}`} />
    );
  }
  return (
    <img src={src} alt={alt} className={`${classes.circleImage} ${classes.large}`} />
  );
}

export default CircleImage;

CircleImage.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['large', 'small']).isRequired,
  alt: PropTypes.string,
};

CircleImage.defaultProps = {
  alt: '',
};
