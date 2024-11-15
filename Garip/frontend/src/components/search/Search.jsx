import React, { useState } from 'react';
import './search.scss';
import close from '../../assets/icons/close-light.svg'
const Search = ({ onSearch, reset }) => {
  const [query, setQuery] = useState('');

  // Handle the input change
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (query.trim() === '') {
        e.preventDefault();  // Prevent the action if the input is empty
        return;  // Exit the function early
      }
      onSearch(query); // Trigger search if input is not empty
    }
  };

  // Trigger the search function (could be passed from parent)
  const handleSearch = () => {
    onSearch(query); // Pass query to parent component
  };

  // Clear search query
  const handleClearSearch = () => {
    setQuery('');
    onSearch(''); // Trigger search with empty query (clear search)
  };

  return (
    <div className="search">
      <input
        className="search__field"
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {reset ? (
        <button className="search__button" onClick={handleClearSearch}><img src={close} alt="close" /></button>
      ) : (
        <button
          className="search__button"
          disabled={!query}
          onClick={handleSearch} // Trigger search only when the button is clicked
        >
          Search
        </button>
      )}
    </div>
  );
};

export default Search;

