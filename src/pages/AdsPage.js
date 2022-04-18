/* eslint-disable react/jsx-one-expression-per-line */
// Should probably enable later, for now it is just useless
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function AdItem(props) {
  const { ad } = props;
  const {
    id, creatorId, title, topics, text, reward, showInList,
  } = ad;
  const navigate = useNavigate();

  function makeResponse() {
    navigate('/new_response', { state: id });
  }

  return (
    <div>
      <p>Ad id {id}</p>
      <p>Ad creator id {creatorId}</p>
      <p>Title {title}</p>
      <p>Topics {topics}</p>
      <p>Text {text}</p>
      <p>Reward {reward}</p>
      <p>Show in list flag {showInList}</p>
      <p><button type="button" onClick={makeResponse}>Respond</button></p>
    </div>
  );
}
AdItem.defaultProps = {
  ad: PropTypes.shape({
    id: 0,
    creatorId: 0,
    title: '',
    topics: [''],
    text: '',
    reward: 0,
    showInList: true,
  }),
};
AdItem.propTypes = {
  ad: PropTypes.shape({
    id: PropTypes.number.isRequired,
    creatorId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    topics: PropTypes.arrayOf(PropTypes.string),
    text: PropTypes.number.isRequired,
    reward: PropTypes.number,
    showInList: PropTypes.bool.isRequired,
  }),
};

function ListOfAds() {
  const [ads, setAds] = useState(Array(0));

  function getAds() {
    // fetch ads from database
    fetch('/return_ads?for=adsPage', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAds(data.ads_data);
          // eslint-disable-next-line no-console
          console.log(data);
        } else {
          throw new Error('Error while fetching ads data');
        }
      });
  }

  useEffect(() => { getAds(); }, []);
  const listOfAds = ads.map((ad) => <AdItem ad={ad} />);
  return (
    <div>
      {listOfAds}
    </div>
  );
}

function AdsPage() {
  return (
    <div>
      <ListOfAds />
    </div>
  );
}

export default AdsPage;
