import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchApp } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import PostItem from '../components/feed/PostItem';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState({ posts: [], events: [], users: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;
    
    const fetchResults = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await searchApp(query);
        setResults(response.data); // Assuming API returns { posts: [], events: [], users: [] }
      } catch (err) {
        const msg = err.response?.data?.message || 'Search failed.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);

  return (
    <>
      <h1 className="page-title">Search Results for "{query}"</h1>
      {isLoading && <LoadingSpinner fullPage={false} />}
      <ErrorMessage message={error} />

      <div className="search-results-list">
        {/* Render Post Results */}
        {results.posts?.length > 0 && (
          <section>
            <h2>Posts</h2>
            {results.posts.map(post => (
              <PostItem key={post._id} post={post} onPostDeleted={() => {}} />
            ))}
          </section>
        )}
        
        {/* You can add rendering for Event and User results here */}
        {/* ... */}

        {!isLoading && !results.posts?.length && !results.events?.length && !results.users?.length && (
          <p>No results found.</p>
        )}
      </div>
    </>
  );
}

export default SearchPage;