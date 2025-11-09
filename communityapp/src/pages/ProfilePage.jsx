import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { updateProfile } from '../services/api';
import ErrorMessage from '../components/common/ErrorMessage';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await updateProfile(formData);
      setUser(response.data.user); // Update user in global context
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card profile-card">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="profile-edit-button"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <ErrorMessage message={error} />

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              name="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              name="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <div className="profile-view">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>College ID:</strong> {user.collegeId}</p>
          <p><strong>Role:</strong> {user.userType}</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;