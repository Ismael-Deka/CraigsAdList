/* eslint-disable react/jsx-one-expression-per-line */
// Should probably enable later, for now it is just useless
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function AdItem(props) {
  const { ad } = props;
  const {
    id, creatorName, title, topics, text, reward,
  } = ad;
  const navigate = useNavigate();

  function makeResponse() {
    navigate('/new_response', { state: id });
  }

  return (
    <div>
      <p>Ad id {id}</p>
      <p>Ad creator name {creatorName}</p>
      <p>Title {title}</p>
      <p>Topics {topics}</p>
      <p>Text {text}</p>
      <p>Reward {reward}</p>
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
    creatorName: PropTypes.string.isRequired,
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
          setAds(data.adsData);
          // eslint-disable-next-line no-console
          console.log(data);
        } else {
          throw new Error('Error while fetching ads data');
        }
      });
  }

  useEffect(() => { getAds(query); }, [props]);
  if (ads.length === 0) {
    return (
      <div>
        No ads are found.
      </div>
    );
  }
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
    if (id.toString().trim() !== '') {
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
    if (reward.toString().trim() !== '') {
      query += `&reward=${reward}`;
    }

    // eslint-disable-next-line no-console
    console.log(`Query params: ${query}`);
    setQuery(query);
  }

  function clearFilters() {
    setID('');
    setCreator('');
    setTitle('');
    setTopics('');
    setText('');
    setReward('');

    setQuery('');
  }

  function isValidNumbericInput(input) {
    const value = +input; // convert to number
    if (value !== +value || value < 0) { // if fails validity check
      return false;
    }

    return true;
  }

  return (
    <div>
      Filter by:
      <form>
        <label htmlFor="id">
          Ad`s #
          <input name="id" type="text" pattern="[0-9]*" value={id} onChange={(e) => (isValidNumbericInput(e.target.value) ? setID(e.target.value) : null)} />
        </label>
        <label htmlFor="creator">
          Posted by:
          <input name="creator" type="text" value={creator} onChange={(e) => setCreator(e.target.value)} />
        </label>
        <label htmlFor="title">
          Title
          <input name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label htmlFor="topics">
          Topics
          <input name="topics" type="text" value={topics} onChange={(e) => setTopics(e.target.value)} />
        </label>
        <label htmlFor="text">
          Text
          <input name="text" type="text" value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <label htmlFor="maxReward">
          Max reward
          <input name="maxReward" type="text" pattern="[0-9]*" value={reward} onChange={(e) => (isValidNumbericInput(e.target.value) ? setReward(e.target.value) : null)} />
        </label>
        <button type="button" onClick={applyFilters}>Apply filters</button>
        <button type="button" onClick={clearFilters}>Clear all filters</button>
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
