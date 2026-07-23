import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, user, error, loading, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    return () => clearError();
    // eslint-disable-next-line
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    register({ name, email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Wallet size={32} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
          <h1>Create account</h1>
          <p>Start tracking your expenses today</p>
        </div>
        {(error || localError) && <div className="form-error">{localError || error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
