import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import NavBar from './Navbar';

function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Wait until we know if the user is logged in or not
    return <LoadingSpinner />;
  }

  if (!user) {
    // User is not logged in, redirect them to the /auth page
    return <Navigate to="/auth" replace />;
  }

  // User is logged in! Show the NavBar and the requested page.
  // The <Outlet /> is a placeholder for the page (e.g., FeedPage, ProfilePage)
  return (
    <>
      <NavBar />
      <main className="main-layout">
        <Outlet />
      </main>
    </>
  );
}

export default ProtectedRoute;