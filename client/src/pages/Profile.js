import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { transactions } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="profile-page fade-in">
      <h1>Profile</h1>
      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <h2 className="profile-name">{user?.name}</h2>
        <p className="profile-email">{user?.email}</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <p className="profile-stat-label">Member Since</p>
            <p className="profile-stat-value">{memberSince}</p>
          </div>
          <div className="profile-stat">
            <p className="profile-stat-label">Total Transactions</p>
            <p className="profile-stat-value">{transactions.length}</p>
          </div>
        </div>
        <button className="btn-secondary btn-full" onClick={handleLogout} style={{ color: 'var(--expense)' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};
