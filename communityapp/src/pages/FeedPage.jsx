import React, { useState, useEffect, useCallback } from 'react';
import { getPosts } from '../services/api';
import CreatePostForm from '../components/feed/CreatePostForm';
import PostItem from '../components/feed/PostItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getPosts();
      // Sort posts to show newest first
      setPosts(response.data.posts.reverse() || response.data.reverse());
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch posts.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = () => {
    // When a new post is created, refresh the feed
    fetchPosts();
  };
  
  const handlePostDeleted = (deletedPostId) => {
    // When a post is deleted, remove it from the state
    setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
  };

  return (
    <div className="feed-layout">
      <div className="feed-posts">
        {isLoading && <LoadingSpinner fullPage={false} />}
        <ErrorMessage message={error} />
        {posts.map((post) => (
          <PostItem 
            key={post._id} 
            post={post} 
            onPostDeleted={handlePostDeleted} 
          />
        ))}
      </div>
      <aside className="feed-sidebar">
        <CreatePostForm onPostCreated={handlePostCreated} />
        {/* You can add other sidebar items here, like upcoming events */}
      </aside>
    </div>
  );
}

export default FeedPage;