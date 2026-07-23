import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, TrendingDown, BarChart3, Shield, ArrowRight, Sparkles } from 'lucide-react';

export const Landing = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/dashboard');
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          Smart Expense Tracking
        </div>
        <h1>Track Every Rupee with Confidence.</h1>
        <p className="hero-desc">
          A simple, beautiful way to manage your finances. Track income, monitor expenses, and gain insights into your spending habits.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
        </div>
        <div className="hero-visual">
          <div className="hero-card-preview">
            <div className="preview-stats">
              <div className="preview-stat">
                <p className="preview-stat-label">Balance</p>
                <p className="preview-stat-value">&#8377;24,500</p>
              </div>
              <div className="preview-stat">
                <p className="preview-stat-label">Income</p>
                <p className="preview-stat-value" style={{ color: 'var(--income)' }}>+&#8377;45,000</p>
              </div>
              <div className="preview-stat">
                <p className="preview-stat-label">Expenses</p>
                <p className="preview-stat-value" style={{ color: 'var(--expense)' }}>-&#8377;20,500</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Everything you need</h2>
        <p className="features-subtitle">Simple tools to help you manage your money better.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon green"><TrendingUp size={22} /></div>
            <h3>Track Income</h3>
            <p>Record all your income sources and watch your earnings grow over time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon red"><TrendingDown size={22} /></div>
            <h3>Track Expenses</h3>
            <p>Categorize and monitor your spending to identify where your money goes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue"><BarChart3 size={22} /></div>
            <h3>Analytics</h3>
            <p>Visual charts and insights to understand your financial patterns.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple"><Shield size={22} /></div>
            <h3>Secure</h3>
            <p>Your data is protected with authentication and encrypted connections.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Expense Tracker. Built with MERN Stack.</p>
      </footer>
    </div>
  );
};
