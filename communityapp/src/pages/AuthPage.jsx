import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import useAuth from '../hooks/useAuth';

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginSuccess = () => {
    // On successful login, redirect to the home page (feed)
    navigate('/');
  };

  const handleRegisterSuccess = () => {
    // On successful registration, show a success message
    // and switch to the login view so they can sign in.
    setShowSuccess(true);
    setIsLoginView(true);
  };

  // If the user is already logged in, don't show this page.
  // Redirect them to the home page.
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="form-card">
        {showSuccess && (
          <div className="success-message">
            Registration successful! Please sign in.
          </div>
        )}

        {isLoginView ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
        )}

        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="form-switch-link"
        >
          {isLoginView
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;