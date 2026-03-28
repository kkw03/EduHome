import React, { useState } from 'react';

export default function FilterPanel({ onApplyFilter, onClearFilters, resultCount }) {
  const [maxBudget, setMaxBudget] = useState('');
  const [minArea, setMinArea] = useState('');
  const [childStartYear, setChildStartYear] = useState('');
  const [error, setError] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    setError('');

    if (maxBudget && (isNaN(maxBudget) || Number(maxBudget) <= 0)) {
      setError('Budget must be a positive number');
      return;
    }
    if (minArea && (isNaN(minArea) || Number(minArea) <= 0)) {
      setError('Area must be a positive number');
      return;
    }
    if (childStartYear && (isNaN(childStartYear) || Number(childStartYear) < 2025 || Number(childStartYear) > 2035)) {
      setError('Year must be between 2025 and 2035');
      return;
    }

    onApplyFilter({
      maxBudget: maxBudget ? Number(maxBudget) : null,
      minArea: minArea ? Number(minArea) : null,
      childStartYear: childStartYear ? Number(childStartYear) : null,
    });
  };

  const handleClear = () => {
    setMaxBudget('');
    setMinArea('');
    setChildStartYear('');
    setError('');
    onClearFilters();
  };

  return (
    <div className="filter-panel">
      <form onSubmit={handleApply}>
        <div className="form-group">
          <label>Max budget ($)</label>
          <input type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} placeholder="600000" />
        </div>
        <div className="form-group">
          <label>Min floor area (sqm)</label>
          <input type="number" value={minArea} onChange={e => setMinArea(e.target.value)} placeholder="70" />
        </div>
        <div className="form-group">
          <label>P1 start year</label>
          <input type="number" value={childStartYear} onChange={e => setChildStartYear(e.target.value)} placeholder="2027" />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">Apply</button>
          <button type="button" className="btn btn-outline" onClick={handleClear}>Clear</button>
        </div>
      </form>

      {resultCount !== undefined && (
        <p className="filter-count">
          {resultCount === 0 ? 'No blocks match criteria' : `${resultCount} blocks`}
        </p>
      )}
    </div>
  );
}
