import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">E</span>
          <span>EduHome</span>
        </Link>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/watchlist"
            className={`navbar-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Watchlist
          </Link>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <>
                <span className="navbar-user">{user.email}</span>
                <button className="btn btn-sm btn-outline" onClick={logout}>Log out</button>
              </>
            ) : (
              <Link to="/watchlist" className="btn btn-sm btn-outline" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
