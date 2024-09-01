// UserTabs.js

import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Spinner } from 'react-bootstrap';
import UserAccountForm from './UserAccountForm';
import PlatformManagementPage from './PlatformManagementPage';

function UserTabs() {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState({});
  const [platforms, setPlatforms] = useState(Array(0));
  // const [adProps, setAdProps] = useState({});

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  const handleAccountInfo = (newAccount) => {
    setAccount((prevAccount) => ({
      ...prevAccount,
      ...newAccount,
    }));
  };

  useEffect(() => {
    fetch('/account_info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Continue processing if status is okay
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      })
      .then((data) => {
        handleAccountInfo(data.account);
        setPlatforms(data.platforms);
        // setAdProps(data.ads);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching account info:', error);
      })
      .finally(
        () => {
          setLoading(false);
        },
      );
  }, []);

  useEffect(() => { }, [account]);
  return (
    <div>
      {
      loading ? (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
        >
          <Spinner animation="border" role="status" variant="secondary" />
        </div>
      ) : (
        <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
          <Tab eventKey="account" className="card-body" title="My Account">
            <UserAccountForm account={account} />
          </Tab>
          <Tab eventKey="platforms" title="My Platforms">
            <PlatformManagementPage platforms={platforms} />
          </Tab>
          <Tab eventKey="ad-props" title="My Campaigns">
            {/* <AdPropositionList /> */}
          </Tab>

        </Tabs>
      )
}
    </div>
  );
}

export default UserTabs;
