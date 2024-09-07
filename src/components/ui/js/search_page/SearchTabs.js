import { Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ResultList from './ResultsList';

function SearchTabs(props) {
  const { searchType } = props;

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(searchType);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    const keyword = params.get('keyword');
    if (keyword !== null) {
      navigate(`/search/${tab}?keyword=${keyword}`);
    } else {
      navigate(`/search/${tab}`);
    }
  };

  useEffect(() => {
    document.title = `Search ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
} - CraigsAdList`;
    // Extract the current tab from the URL
    const pathParts = location.pathname.split('/');
    const currentTab = pathParts[2]; // Assuming the URL structure is /search/<tab>

    // If the tab in the URL is different from the activeTab, update the activeTab state
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname, activeTab]);

  return (
    <div>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
        <Tab
          eventKey="platforms"
          className="card-body"
          title="Platforms"
        />
        <Tab
          eventKey="campaigns"
          className="card-body"
          title="Ad Campaigns"
        />
        <Tab
          eventKey="users"
          className="card-body"
          title="Users"
        />
      </Tabs>
      <ResultList resultType={searchType} />
    </div>
  );
}

export default SearchTabs;

SearchTabs.defaultProps = {
  searchType: 'platforms',
};

SearchTabs.propTypes = {
  searchType: PropTypes.string,
};
