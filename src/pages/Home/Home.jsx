import React, { useState } from 'react';
import styles from './Home.module.css';
import magnifyingGlass from '../../global/images/magnifying-glass 1.svg'; // Adjust the path accordingly

const Home = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    try {
      const response = await fetch(`http://172.16.117.43:2345/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data); // Check the structure of the data
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
        console.error('Expected an array but got:', data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

  return (
    <div className={styles['home-container']}>
      <div className={styles['search-panel']}>
        <h1>Search Judgements</h1>
        <form onSubmit={handleSearch} className={styles['search-form']}>
          <div className={styles['input-container']}>
            <img src={magnifyingGlass} alt="Search" className={styles['search-icon']} />
            <input
              type="text"
              placeholder="Search by topic, case number, judge name, date, etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles['search-input']}
            />
            <button type="submit" className={styles['search-button']}>Search</button>
          </div>
        </form>
      </div>
      {searched && (
        <div className={styles['results-panel']}>
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.id} className={styles['result-item']}>
                <h2>{result.title}</h2>
                <p>{result.body.substring(0, 300)}...</p> {/* Show a preview of the body */}
                <details>
                  <summary>View details</summary>
                  <div className={styles['full-text']}>
                    {result.body.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </details>
                <p><strong>Document Name:</strong> {result.doc_name}</p>
                <p><strong>Score:</strong> {result.score}</p>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
