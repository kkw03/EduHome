import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isRegister
      ? await register(email, password, contactNo)
      : await login(email, password);

    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isRegister ? 'Create account' : 'Log in'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          {isRegister && (
            <div className="form-group">
              <label>Contact number (optional)</label>
              <input
                type="tel"
                value={contactNo}
                onChange={e => setContactNo(e.target.value)}
                placeholder="91234567"
              />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Create account' : 'Log in')}
          </button>
          <p className="form-hint">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" className="link-btn" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
              {isRegister ? 'Log in' : 'Register'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
