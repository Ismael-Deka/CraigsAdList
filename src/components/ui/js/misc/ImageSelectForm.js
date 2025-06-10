import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Stack } from 'react-bootstrap';
import CircleImage from './CircleImage';

function ImageSelectForm({ currentProfilePic, setProfilePic, imgSize }) {
  const [displayProfilePic, setDisplayPfp] = useState(currentProfilePic);

  useEffect(() => { setDisplayPfp(currentProfilePic); }, [currentProfilePic]);

  const handleProfilePictureChange = (event) => {
    const selectedPfp = event.target.files[0];
    const reader = new FileReader();
    setProfilePic(selectedPfp);

    reader.readAsDataURL(selectedPfp);

    reader.onload = () => {
      const base64Pfp = reader.result;
      setDisplayPfp(base64Pfp);
    };
  };

  return (
    <Stack gap={3} style={{ alignItems: 'center' }}>
      <CircleImage src={displayProfilePic} size={imgSize} />
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
  setProfilePic: PropTypes.func.isRequired,
  imgSize: PropTypes.string,
};

export default ImageSelectForm;
