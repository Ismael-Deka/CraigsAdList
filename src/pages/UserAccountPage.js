/* eslint-disable react/no-array-index-key */
// import { useEffect, useState } from 'react';
// import UserAccountForm from '../components/ui/js/user_accounts/UserAccountForm';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import UserTabs from '../components/ui/js/user_accounts/UserTabs';

function UserAccountPage() {
  // const [account, setAccount] = useState({});
  // const [ads, setAds] = useState([]);
  // const [channels, setChannels] = useState([]);

  /* useEffect(() => {
    fetch('/account_info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAccount(data.account);
        // setAds(data.ads);
        // setChannels(data.channels);
      });
  }, []); */

  /* function handleAdDelete(i) {
    setAds([...ads.slice(0, i), ...ads.slice(i + 1)]);
  } */

  return (
    <Container>
      <Row className="mt-5">
        <Col md={12}>
          <h1 className="mb-3">Settings</h1>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <UserTabs />
        </Col>
      </Row>
    </Container>
  );
}

export default UserAccountPage;
