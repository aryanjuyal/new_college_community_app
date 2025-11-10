import React, { useState } from 'react';
import { addComment, deletePost } from '../../services/api';
import useAuth from '../../hooks/useAuth';

function PostItem({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  // Check if the logged-in user is the author of the post
  const isAuthor = user._id === post.author._id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
        onPostDeleted(post._id); // Notify parent to remove from list
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post.');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await addComment(post._id, newComment);
      // The API should return the new comment object, including the populated author
      const newCommentData = response.data;
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment.');
    }
  };

  return (
    <div className="card post-item">
      <div className="post-header">
        <span className="post-author">{post.author.name}</span>
        {isAuthor && (
          <button onClick={handleDelete} className="post-delete-button">
            Delete
          </button>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      {post.imageURL && (
        <img src={post.imageURL} alt="Post" className="post-image" />
      )}

      <div className="post-meta">
        {new Date(post.createdAt).toLocaleString()}
      </div>

      <div className="post-actions">
        <button
          onClick={() => setShowComments(!showComments)}
          className="post-comment-toggle"
        >
          {showComments ? 'Hide' : 'Show'} Comments ({comments.length})
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <span className="comment-author">{comment.author.name}:</span>
                {comment.text}
              </div>
            ))}
          </div>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="comment-submit-button">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostItem;