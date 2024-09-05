/* eslint-disable react/no-array-index-key */
// import { useEffect, useState } from 'react';
// import UserAccountForm from '../components/ui/js/user_accounts/UserAccountForm';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import UserTabs from '../components/ui/js/settings_page/UserTabs';

function SettingsPage() {
  // const [account, setAccount] = useState({});
  // const [campaigns, setCampaigns] = useState([]);
  // const [platforms, setPlatforms] = useState([]);

  /* useEffect(() => {
    fetch('/account_info', {
      method: 'GET',
      hecampaigners: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAccount(data.account);
        // setCampaigns(data.campaigns);
        // setPlatforms(data.platforms);
      });
  }, []); */

  /* function handleCampaignDelete(i) {
    setCampaigns([...campaigns.slice(0, i), ...campaigns.slice(i + 1)]);
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

export default SettingsPage;
