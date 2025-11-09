import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { login } from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onLoginSuccess }) {
  // --- THIS IS THE FIX ---
  // Changed from 'email' to 'username'
  const [username, setUsername] = useState('');
  // -----------------------

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // --- THIS IS THE FIX ---
      // We now pass 'username' to the login function
      const response = await login(username, password);
      // -----------------------

      // Save token and user data to context
      setAuthToken(response.data.token);
      setUser(response.data.user);
      
      // Navigate to home page
      navigate('/');
      
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="form-title">Sign In</h2>
      <ErrorMessage message={error} />
      
      {/* --- THIS IS THE FIX --- */}
      {/* This form group now asks for Username instead of Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="login-username">Username</label>
        <input
          id="login-username"
          type="text"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      {/* ----------------------- */}

      <div className="form-group">
        <label className="form-label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="form-button" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

export default LoginForm;