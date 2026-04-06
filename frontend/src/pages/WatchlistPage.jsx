import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import { getWatchlist, addWatchlistItem, removeWatchlistItem } from '../services/watchlistService';
import { getSchools } from '../services/searchService';

export default function WatchlistPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [items, setItems] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showForm, setShowForm] = useState(!!location.state?.school);
  const [confirmation, setConfirmation] = useState('');
  const [loadingItems, setLoadingItems] = useState(false);

  const [formSchool, setFormSchool] = useState(location.state?.school?.school_id || '');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingItems(true);
      getWatchlist()
        .then(setItems)
        .catch(() => setItems([]))
        .finally(() => setLoadingItems(false));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getSchools()
      .then(setSchools)
      .catch(() => setSchools([]));
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="watchlist-page">
        <div className="auth-gate">
          <h2>Authentication required</h2>
          <p>Log in to manage your watchlist and receive alerts when new transactions match your criteria.</p>
          <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Log in</button>
        </div>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    );
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formSchool) { setFormError('Select a school'); return; }
    if (!minBudget || !maxBudget) { setFormError('Enter budget range'); return; }
    if (Number(minBudget) >= Number(maxBudget)) { setFormError('Max must exceed min budget'); return; }

    try {
      const newItem = await addWatchlistItem(Number(formSchool), Number(minBudget), Number(maxBudget));
      // Refresh the list to get full data including school_name
      const refreshed = await getWatchlist();
      setItems(refreshed);
      setShowForm(false);
      setFormSchool('');
      setMinBudget('');
      setMaxBudget('');
      setConfirmation('Item added to watchlist');
      setTimeout(() => setConfirmation(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleDelete = async (watchId) => {
    try {
      await removeWatchlistItem(watchId);
      setItems(items.filter(i => i.watch_id !== watchId));
      setConfirmation('Item removed');
      setTimeout(() => setConfirmation(''), 3000);
    } catch (err) {
      setConfirmation('Failed to remove item');
      setTimeout(() => setConfirmation(''), 3000);
    }
  };

  const toggleActive = (watchId) => {
    setItems(items.map(i =>
      i.watch_id === watchId ? { ...i, is_active: !i.is_active } : i
    ));
  };

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1>Watchlist</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add school'}
        </button>
      </div>

      {confirmation && <div className="confirmation-banner">{confirmation}</div>}

      {showForm && (
        <div className="watchlist-form panel-card">
          <h3 className="panel-title">New watchlist item</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>School</label>
              <select value={formSchool} onChange={e => setFormSchool(e.target.value)}>
                <option value="">Select a school</option>
                {schools.map(s => (
                  <option key={s.school_id} value={s.school_id}>{s.official_name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Min budget ($)</label>
                <input type="number" value={minBudget} onChange={e => setMinBudget(e.target.value)} placeholder="400000" />
              </div>
              <div className="form-group">
                <label>Max budget ($)</label>
                <input type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} placeholder="600000" />
              </div>
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      <div className="watchlist-list">
        {loadingItems ? (
          <div className="empty-state"><p>Loading...</p></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No watchlist items yet.</p>
            <p>Search for a school and add it to get started.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.watch_id} className={`watchlist-item ${!item.is_active ? 'inactive' : ''}`}>
              <div className="watchlist-item-main">
                <div className="watchlist-item-info">
                  <h3>{item.school_name}</h3>
                  <p className="watchlist-budget">
                    ${Number(item.min_budget).toLocaleString()} &ndash; ${Number(item.max_budget).toLocaleString()}
                  </p>
                </div>
                <div className="watchlist-item-status">
                  <span className={`status-badge ${item.is_active ? 'active' : 'paused'}`}>
                    {item.is_active ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
              <div className="watchlist-item-actions">
                <button className="btn btn-sm btn-outline" onClick={() => toggleActive(item.watch_id)}>
                  {item.is_active ? 'Pause' : 'Resume'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.watch_id)}>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
