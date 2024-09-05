import React from 'react';

function UnfinishedHeader() {
  const UnfinishedHeaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontSize: '3rem',
    fontWeight: 'bold',
  };

  return (
    <UnfinishedHeader style={UnfinishedHeaderStyle}>
      UNDER CONSTRUCTION
    </UnfinishedHeader>
  );
}

export default UnfinishedHeader;
