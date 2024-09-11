// UserTabs.js

import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Spinner } from 'react-bootstrap';
import UserAccountForm from './UserAccountForm';
import MyPlatformsCampaignsList from './MyPlatformsCampaignsList';

function UserTabs() {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState({});
  const [platforms, setPlatforms] = useState(Array(0));
  const [campaignProps, setCampaignProps] = useState({});
  const [isPlatformOwner, setIsPlatformOwner] = useState(false);

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
        setIsPlatformOwner(data.account.platform_owner);
        if (data.platforms !== null) {
          setPlatforms(data.platforms);
        } else {
          setCampaignProps(data.campaigns);
        }
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
          <Tab eventKey="platformsCampaigns" title={isPlatformOwner ? 'My Platforms' : 'My Campaigns'}>
            <MyPlatformsCampaignsList
              platforms={isPlatformOwner ? platforms : []}
              campaigns={!isPlatformOwner ? campaignProps : []}
            />
          </Tab>

        </Tabs>
      )
}
    </div>
  );
}

export default UserTabs;
