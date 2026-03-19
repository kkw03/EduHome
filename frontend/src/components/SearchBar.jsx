import React, { useState, useRef, useEffect } from 'react';
import { getSchoolSuggestions } from '../data/dummyData';

export default function SearchBar({ onSearch, size = 'large' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setError('');
    if (val.length >= 2) {
      const matches = getSchoolSuggestions(val);
      setSuggestions(matches);
      setShowDropdown(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (school) => {
    setQuery(school.official_name);
    setShowDropdown(false);
    onSearch(school);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a school name');
      return;
    }
    const matches = getSchoolSuggestions(query);
    if (matches.length === 0) {
      setError('School not found. Please check the name and try again.');
      return;
    }
    handleSelect(matches[0]);
  };

  return (
    <div className={`search-bar ${size}`} ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="search-bar-form">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for a primary school..."
            className="search-input"
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn-primary search-btn">Search</button>
      </form>

      {showDropdown && (
        <ul className="search-dropdown">
          {suggestions.map(s => (
            <li key={s.school_id} onClick={() => handleSelect(s)} className="search-dropdown-item">
              <span className="search-dropdown-name">{s.official_name}</span>
              <span className="search-dropdown-postal">({s.postal_code})</span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="search-error">{error}</p>}
    </div>
  );
}
