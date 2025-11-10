import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import NavBar from './NavBar';
import LoadingSpinner from './LoadingSpinner';
import Chatbot from '../chatbot/chatbot';

function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <NavBar />
      <main className="main-layout">
        <Outlet />
      </main>
      <Chatbot /> {/* <-- 2. ADD THE CHATBOT COMPONENT HERE */}
    </>
  );
}

export default ProtectedRoute;