import PropTypes from 'prop-types';
import classes from '../../css/LoginErrorDialog.module.css';

function LoginErrorDialog({
  message, onCancel, onRedirect,
}) {
  function cancelHandler() {
    onCancel();
    onRedirect();
  }

  return (
    <div>
      <div className={classes.errordialog}>
        <p>{message}</p>
        <button type="button" className={classes.btn} onClick={cancelHandler}>Close</button>
      </div>
      <div className={classes.backdrop} />
    </div>
  );
}

export default LoginErrorDialog;

LoginErrorDialog.defaultProps = {
  message: '',
  onRedirect: () => {},
  onCancel: () => {},
};

LoginErrorDialog.propTypes = {
  message: PropTypes.string,
  onRedirect: PropTypes.func,
  onCancel: PropTypes.func,
};
