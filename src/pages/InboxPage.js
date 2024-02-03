import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, ListGroup,
} from 'react-bootstrap';
import MessageList from '../components/ui/js/inbox_page/MessageList';

function InboxPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { folder } = params;

  const navigateToFolder = (newFolder) => {
    navigate(newFolder);
  };
  return (
    <Container className="mt-5">
      <Row>
        {/* List Group */}
        <Col md={2}>
          <ListGroup>
            <ListGroup.Item
              action
              active={folder === 'inbox'}
              onClick={() => {
                if (folder !== 'inbox') navigateToFolder('/messages/inbox');
              }}
            >
              Inbox
            </ListGroup.Item>

            <ListGroup.Item
              action
              active={folder === 'sent'}
              onClick={() => {
                if (folder !== 'sent') navigateToFolder('/messages/sent');
              }}
            >
              Sent
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={folder === 'draft'}
              onClick={() => {
                if (folder !== 'draft') navigateToFolder('/messages/draft');
              }}
            >
              Drafts
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={folder === 'trash'}
              onClick={() => {
                if (folder !== 'trash') navigateToFolder('/messages/trash');
              }}
            >
              Trash
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={folder === 'notifications'}
              onClick={() => {
                if (folder !== 'notifications') navigateToFolder('/messages/notifications');
              }}
            >
              Notifications
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={folder === 'offers'}
              onClick={() => {
                if (folder !== 'offers') navigateToFolder('/messages/offers');
              }}
            >
              Offers
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={10}>
          <MessageList />
        </Col>
      </Row>
    </Container>
  );
}

export default InboxPage;
