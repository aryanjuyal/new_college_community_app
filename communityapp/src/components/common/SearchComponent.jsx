import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Navigate to the search results page with the query
    navigate(`/search?q=${query}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input"
        placeholder="Search for posts, events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchComponent;