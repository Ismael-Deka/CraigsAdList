// UserTabs.js

import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import UserAccountForm from './UserAccountForm';
import PlatformManagementPage from './PlatformManagementPage';

function UserTabs() {
  const [activeTab, setActiveTab] = useState('account');

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
      <Tab eventKey="account" className="card-body" title="My Account">
        <UserAccountForm />
      </Tab>
      <Tab eventKey="platforms" title="My Platforms">
        <PlatformManagementPage />
      </Tab>
      <Tab eventKey="ad-props" title="My Propositions">
        {/* <AdPropositionList /> */}
      </Tab>

    </Tabs>
  );
}

export default UserTabs;
