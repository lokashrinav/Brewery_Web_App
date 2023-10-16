import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.openbrewerydb.org/breweries');

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const totalBreweries = data.length;

  const breweryTypeDistribution = data.reduce((typeCounts, brewery) => {
    typeCounts[brewery.brewery_type] = (typeCounts[brewery.brewery_type] || 0) + 1;
    return typeCounts;
  }, {});

  const stateDistribution = data.reduce((stateCounts, brewery) => {
    stateCounts[brewery.state_province] = (stateCounts[brewery.state_province] || 0) + 1;
    return stateCounts;
  }, {});

  const breweryTypes = [
    'micro',
    'nano',
    'regional',
    'brewpub',
    'large',
    'planning',
    'bar',
    'contract',
    'proprietor',
    'closed',
  ];

  const states = [...new Set(data.map(brewery => brewery.state_province))];

  const filteredBreweries = data.filter(brewery => {
    const typeMatches = !filterType || brewery.brewery_type === filterType;
    const stateMatches = !filterState || brewery.state_province === filterState;
    const nameMatches =
      !filterName || brewery.name.toLowerCase().includes(filterName.toLowerCase());

    return typeMatches && stateMatches && nameMatches;
  });

  return (
    <div className="app-container">
      <div className="summary-statistics">
        <p>Total Breweries: {totalBreweries}</p>
        <p>Brewery Types: {Object.entries(breweryTypeDistribution).map(([type, count]) => `${type}: ${count}`).join(', ')}</p>
        <p>States: {Object.entries(stateDistribution).map(([state, count]) => `${state}: ${count}`).join(', ')}</p>
      </div>
      <div className="filter-container">
        <label htmlFor="filterType">Filter by Brewery Type:</label>
        <select
          id="filterType"
          onChange={e => setFilterType(e.target.value)}
          value={filterType}
        >
          <option value="">All</option>
          {breweryTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-container">
        <label htmlFor="filterState">Filter by State:</label>
        <select
          id="filterState"
          onChange={e => setFilterState(e.target.value)}
          value={filterState}
        >
          <option value="">All</option>
          {states.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-container">
        <label htmlFor="filterName">Filter by Brewery Name:</label>
        <input
          type="text"
          id="filterName"
          placeholder="Search by name..."
          onChange={e => setFilterName(e.target.value)}
          value={filterName}
        />
      </div>
      <ul className="brewery-list">
        {filteredBreweries.map(brewery => (
          <li key={brewery.id} className="brewery-item">
            <h3>Name: {brewery.name}</h3>
            <p>Brewery Type: {brewery.brewery_type}</p>
            <p>Location: {brewery.city}, {brewery.state_province}</p>
            <p>Website: <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
