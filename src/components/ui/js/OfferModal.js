import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

function OfferModal({ platformId }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOfferSubmit = () => fetch('/send_offer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      owner_id: platformId,
      price,
      message,
    }),
  });

  const handleSubmit = () => {
    handleOfferSubmit({ platformId, message, price });
    handleClose();
  };

  return (
    <>
      <Button size="sm" style={{ float: 'left' }} variant="primary" onClick={handleShow}>
        Make an Offer
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Make an Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="message">
            <Form.Label>Message (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Offer Price</Form.Label>
            <Form.Control
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Offer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
OfferModal.propTypes = {
  platformId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default OfferModal;
