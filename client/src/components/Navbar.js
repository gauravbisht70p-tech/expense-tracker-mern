import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { Wallet, LayoutDashboard, BarChart3, User, Sun, Moon, LogOut, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  // Don't show navbar on auth pages
  if (['/login', '/register'].includes(location.pathname)) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={user ? '/dashboard' : '/'} className="nav-logo">
          <Wallet size={22} />
          ExpenseTracker
        </Link>

        {user ? (
          <>
            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
              <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/analytics" className={isActive('/analytics')} onClick={() => setMenuOpen(false)}>
                <BarChart3 size={16} /> Analytics
              </Link>
              <Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>
                <User size={16} /> Profile
              </Link>
            </div>
            <div className="nav-right">
              <span className="nav-user">{user.name}</span>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button className="nav-link" onClick={logout} style={{ color: 'var(--text-muted)' }}>
                <LogOut size={16} />
              </button>
              <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        ) : (
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
