import React, { useState } from 'react';
import {
  Container, Col, ListGroup, Button, Modal,
} from 'react-bootstrap';

function MessageList() {
  const [receivedMessages, setReceivedMessages] = useState([
    {
      id: 1,
      sender: 'John Doe',
      title: 'Important Update',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      timeSent: '2024-01-20T12:30:00', // Placeholder for time sent
      replyThread: [
        {
          id: 101, sender: 'Your Name', content: 'Reply 1', timeSent: '2024-01-20T13:00:00',
        },
        // Add more replies as needed
      ],
    },
    {
      id: 2,
      sender: 'Jane Smith',
      title: 'Meeting Tomorrow',
      content: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
      timeSent: '2024-01-21T08:45:00', // Placeholder for time sent
      replyThread: [
        {
          id: 102, sender: 'Your Name', content: 'Reply 1', timeSent: '2024-01-21T09:00:00',
        },
        {
          id: 103, sender: 'Jane Smith', content: 'Reply 2', timeSent: '2024-01-21T09:15:00',
        },
        // Add more replies as needed
      ],
    },
    // Add more dummy messages as needed
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState('');

  const handleCloseComposeModal = () => {
    setShowComposeModal(false);
  };

  // eslint-disable-next-line no-unused-vars
  const handleSendMessage = () => {
    // Simulate sending a new message by adding it to the receivedMessages array
    const newMessage = {
      id: receivedMessages.length + 1,
      sender: 'Your Name',
      title: 'New Message',
      content: newMessageContent,
      timeSent: new Date().toDateString(), // Placeholder for current time
      replyThread: [],
    };

    setReceivedMessages([...receivedMessages, newMessage]);
    setNewMessageContent('');
    setShowComposeModal(false);
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setShowComposeModal(true);
  };

  return (
    <Container>
      <Col md={13}>
        <h2>Inbox</h2>
        <ListGroup>
          {receivedMessages.map((message) => (
            <ListGroup.Item
              key={message.id}
              action
              onClick={() => handleSelectMessage(message)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ flex: '0 0 20%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <strong>{message.sender}</strong>
              </div>
              <div style={{
                flex: '0 0 20%', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 10px',
              }}
              >
                {message.title}
              </div>
              <div style={{
                flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 10px', whiteSpace: 'nowrap',
              }}
              >
                {message.content}
              </div>
              <div style={{ flex: '0 0 20%' }}>
                {new Date(message.timeSent).toLocaleString()}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* View Message Modal */}
        <Modal centered show={showComposeModal} onHide={handleCloseComposeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMessage && selectedMessage.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedMessage && selectedMessage.content}</p>
            {selectedMessage && selectedMessage.replyThread.length > 0 && (
            <div>
              <strong>Reply Thread:</strong>
              {selectedMessage.replyThread.map((reply) => (
                <div key={reply.id}>
                  <em>{reply.sender}</em>
                  {' '}
                  -
                  {reply.content}
                  {' '}
                  (
                  {new Date(reply.timeSent).toLocaleString()}
                  )
                </div>
              ))}
            </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseComposeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Container>
  );
}

export default MessageList;
