import React, { useState } from 'react';
import { getCommuteResults } from '../data/dummyData';

export default function CommuteOptimizer({ schoolId, schoolName }) {
  const [origin, setOrigin] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!origin.trim()) {
      setError('Enter your home address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setResults(getCommuteResults(schoolId));
      setLoading(false);
    }, 400);
  };

  const handleReset = () => {
    setOrigin('');
    setResults(null);
    setError('');
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">Commute optimizer</h3>
      </div>
      <p className="panel-desc">
        Best Silver zone blocks by bus travel time to {schoolName || 'school'}
      </p>

      <form onSubmit={handleSearch} className="commute-form">
        <div className="form-group">
          <label>Home address</label>
          <input
            type="text"
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            placeholder="123 Clementi Ave 3"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="filter-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Find routes'}
          </button>
          {results && <button type="button" className="btn btn-outline" onClick={handleReset}>Reset</button>}
        </div>
      </form>

      {results && (
        <div className="commute-results">
          <h4>Results</h4>
          {results.map((r, i) => (
            <div key={r.block_id} className={`commute-item ${i === 0 ? 'best' : ''}`}>
              {i === 0 && <span className="best-badge">Shortest</span>}
              <div className="commute-block">
                <strong>Blk {r.block_num}</strong> {r.street_name}
              </div>
              <div className="commute-details">
                <span className="commute-time">{r.travel_time_min} min</span>
                <span className="commute-dist">{r.distance_km} km</span>
                <span className="commute-route">{r.route}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
