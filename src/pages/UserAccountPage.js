/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';

function UserAccountPage() {
  const [account, setAccount] = useState({});
  const [ads, setAds] = useState([]);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetch('/account_info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAccount(data.account);
        setAds(data.ads);
        setChannels(data.channels);
      });
  }, []);

  function handleAdDelete(i) {
    setAds([...ads.slice(0, i), ...ads.slice(i + 1)]);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1>User Account</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Account Info</h5>
              <p className="card-text">
                <strong>Name:</strong>
                {' '}
                {account.username}
              </p>
              <p className="card-text">
                <strong>Email:</strong>
                {' '}
                {account.email}
              </p>
              <h5 className="card-title">Ads</h5>
              <div className="row">
                {ads.map((ad, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{ad.title}</h5>
                        <p className="card-text">
                          <strong>Topics:</strong>
                          {' '}
                          {ad.topic}
                        </p>
                        <p className="card-text">
                          <strong>Text:</strong>
                          {' '}
                          {ad.text}
                        </p>
                        <p className="card-text">
                          <strong>Reward:</strong>
                          {' '}
                          {ad.reward}
                        </p>
                        <button type="button" onClick={() => handleAdDelete(i)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <h5 className="card-title">Channels</h5>
              <div className="row">
                {channels.map((channel, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{channel.channel_name}</h5>
                        <p className="card-text">
                          <strong>Subscribers:</strong>
                          {' '}
                          {channel.subscribers}
                        </p>
                        <p className="card-text">
                          <strong>Topics:</strong>
                          {' '}
                          {channel.topic}
                        </p>
                        <p className="card-text">
                          <strong>Reward:</strong>
                          {' '}
                          {channel.preferred_reward}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAccountPage;
