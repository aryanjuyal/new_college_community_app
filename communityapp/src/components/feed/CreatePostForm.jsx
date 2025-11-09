import React, { useState } from 'react';
import { createPost } from '../../services/api';

function CreatePostForm({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      setError('Post content cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');

    // We must use FormData because we are uploading a file (image)
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await createPost(formData);
      // Reset form and notify parent
      setContent('');
      setImage(null);
      e.target.reset(); // Resets the file input
      onPostCreated(); // Triggers a refresh of the post list
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create post.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">Create a New Post</h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label className="form-label" htmlFor="post-content">What's on your mind?</label>
          <textarea
            id="post-content"
            className="form-textarea"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="post-image">Add an Image (Optional)</label>
          <input
            id="post-image"
            type="file"
            accept="image/*"
            className="form-input"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePostForm;