import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import SearchComponent from './SearchComponent';

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth'); // Redirect to login page after logout
  };

  // Helper for NavLink to add 'active' class
  const getNavLinkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className="nav-logo">
          CollegeConnect
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" className={getNavLinkClass}>
            Feed
          </NavLink>
          <NavLink to="/events" className={getNavLinkClass}>
            Events
          </NavLink>
          <NavLink to="/chat" className={getNavLinkClass}>
            Chat
          </NavLink>
          <NavLink to="/profile" className={getNavLinkClass}>
            Profile
          </NavLink>
        </div>
      </div>
      <div className="nav-right">
        <SearchComponent />
        {user && <span className="nav-user-name">Welcome, {user.name}</span>}
        <button onClick={handleLogout} className="nav-logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;