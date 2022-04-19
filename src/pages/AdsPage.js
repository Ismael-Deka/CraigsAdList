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

function ListOfAds(props) {
  const { query } = props;
  const [ads, setAds] = useState(Array(0));

  function getAds(newQuery) {
    // eslint-disable-next-line no-console
    console.log(`Path for ads fetching: /return_ads?for=adsPage${query}`);
    // fetch ads from database
    fetch(`/return_ads?for=adsPage${newQuery}`, {
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

  useEffect(() => { getAds(query); }, [props]);
  const listOfAds = ads.map((ad) => <AdItem ad={ad} />);
  return (
    <div>
      {listOfAds}
    </div>
  );
}
ListOfAds.defaultProps = {
  query: '',
};
ListOfAds.propTypes = {
  query: PropTypes.string,
};

function SearchBar(props) {
  const { setQuery } = props;
  const [id, setID] = useState('');
  const [creator, setCreator] = useState('');
  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState('');
  const [text, setText] = useState('');
  const [reward, setReward] = useState('');

  function applyFilters() {
    let query = '';
    if (id.trim() !== '') {
      query += `&id=${id}`;
    }
    if (creator.trim() !== '') {
      query += `&creator=${creator}`;
    }
    if (title.trim() !== '') {
      query += `&title=${title}`;
    }
    if (topics.trim() !== '') {
      query += `&topics=${topics}`;
    }
    if (text.trim() !== '') {
      query += `&text=${text}`;
    }
    if (reward.trim() !== '') {
      query += `&reward=${reward}`;
    }

    // eslint-disable-next-line no-console
    console.log(`Query params: ${query}`);
    setQuery(query);
  }

  return (
    <div>
      Filter by:
      <form>
        <label htmlFor="id">
          Ad`s ID
          <input name="id" type="text" inputMode="numeric" onChange={(e) => setID(e.target.value)} />
        </label>
        <label htmlFor="creator">
          Posted by:
          <input name="creator" type="text" onChange={(e) => setCreator(e.target.value)} />
        </label>
        <label htmlFor="title">
          Title
          <input name="title" type="text" onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label htmlFor="topics">
          Topics
          <input name="topics" type="text" onChange={(e) => setTopics(e.target.value)} />
        </label>
        <label htmlFor="text">
          Text
          <input name="text" type="text" onChange={(e) => setText(e.target.value)} />
        </label>
        <label htmlFor="maxReward">
          Max reward
          <input name="maxReward" type="text" inputMode="numeric" onChange={(e) => setReward(e.target.value)} />
        </label>
        <button type="button" onClick={applyFilters}>Apply filters</button>
      </form>
    </div>

  );
}
SearchBar.defaultProps = {
  setQuery: () => { },
};
SearchBar.propTypes = {
  setQuery: PropTypes.func,
};

function AdsPage() {
  const [query, setQuery] = useState('');
  return (
    <div>
      <SearchBar setQuery={(newQuery) => setQuery(newQuery)} />
      <ListOfAds query={query} />
    </div>
  );
}

export default AdsPage;
