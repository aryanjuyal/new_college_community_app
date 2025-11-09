import React, { useState } from 'react';
import { register } from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';

function RegisterForm({ onRegisterSuccess }) {
  // STEP 1: Added 'password2' to the state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', // Added this field
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // STEP 2: Added client-side password match validation
    if (formData.password !== formData.password2) {
      setError('Passwords do not match.');
      return; // Stop the submission
    }

    setIsLoading(true);

    try {
      // The 'formData' object now sends all required fields
      await register(formData);
      
      // Tell the AuthPage to switch to the login view
      onRegisterSuccess();

    } catch (err) {
      // This is the improved error handling
      let errorMsg = 'Registration failed. Please try again.';
      if (err.response && err.response.data) {
        // This will display specific backend errors
        // (e.g., "username already exists")
        const errorData = err.response.data;
        const messages = [];
        
        // Recursive function to find all string values in the error object
        function findErrorStrings(obj) {
          if (typeof obj === 'string') {
            messages.push(obj);
          } else if (Array.isArray(obj)) {
            obj.forEach(findErrorStrings);
          } else if (typeof obj === 'object' && obj !== null) {
            Object.values(obj).forEach(findErrorStrings);
          }
        }
        
        findErrorStrings(errorData);
        
        if (messages.length > 0) {
          // Join all found error messages into a single string
          errorMsg = [...new Set(messages)].join(' ');
        }
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="form-title">Create Account</h2>
      <ErrorMessage message={error} />
      
      {/* These are the 4 required fields from the documentation */}
      
      <div className="form-group">
        <label className="form-label" htmlFor="reg-username">Username</label>
        <input
          id="reg-username"
          name="username"
          type="text"
          className="form-input"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          name="email"
          type="email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          name="password"
          type="password"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* STEP 3: Added the "Confirm Password" input field */}
      <div className="form-group">
        <label className="form-label" htmlFor="reg-password2">Confirm Password</label>
        <input
          id="reg-password2"
          name="password2"
          type="password"
          className="form-input"
          value={formData.password2}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="form-button" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}

export default RegisterForm;