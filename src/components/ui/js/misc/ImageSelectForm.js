import React from 'react';
import PropTypes from 'prop-types';
import { Form, Stack } from 'react-bootstrap';
import CircleImage from './CircleImage';

function ImageSelectForm({ currentProfilePic, handleProfilePictureChange, imgSize }) {
  return (
    <Stack gap={3} style={{ alignItems: 'center' }}>
      <CircleImage src={currentProfilePic} size={imgSize} />
      <Form>
        <Form.Group controlId="formFile" className="mb-1">
          <Form.Control type="file" accept="image/*" onChange={handleProfilePictureChange} />
        </Form.Group>
      </Form>
    </Stack>
  );
}
ImageSelectForm.defaultProps = {
  imgSize: '',
};

ImageSelectForm.propTypes = {
  currentProfilePic: PropTypes.string.isRequired,
  handleProfilePictureChange: PropTypes.func.isRequired,
  imgSize: PropTypes.string,
};

export default ImageSelectForm;
