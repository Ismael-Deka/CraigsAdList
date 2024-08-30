import { Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ResultList from './ResultsList';

function SearchTabs(props) {
  const {
    searchType,
  } = props;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchType);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    console.log(searchType);
    navigate(`/search/${tab}`);
  };

  useEffect(() => {}, [searchType]);

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
