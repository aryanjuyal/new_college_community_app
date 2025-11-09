import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsersForChat } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function ChatListPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getUsersForChat();
        setUsers(response.data.users || response.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load users.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <h1 className="page-title">Start a Conversation</h1>
      {isLoading && <LoadingSpinner fullPage={false} />}
      <ErrorMessage message={error} />
      <div className="card">
        <div className="user-list">
          {users.map(user => (
            <Link 
              key={user._id} 
              to={`/chat/${user._id}`} 
              className="user-list-item"
            >
              {user.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default ChatListPage;