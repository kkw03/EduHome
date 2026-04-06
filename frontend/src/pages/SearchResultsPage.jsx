import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import HiddenGems from '../components/HiddenGems';
import TrendChart from '../components/TrendChart';
import Heatmap from '../components/Heatmap';
import BallotRisk from '../components/BallotRisk';
import LeaseGuard from '../components/LeaseGuard';
import CommuteOptimizer from '../components/CommuteOptimizer';
import useSearch from '../hooks/useSearch';
import useMapOverlays from '../hooks/useMapOverlays';

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSchool, blocks, loading, error, performSearch, applyFilters, clearFilters } = useSearch();
  const { heatmapActive, hiddenGemsActive, leaseGuardActive, toggleHeatmap, toggleHiddenGems, toggleLeaseGuard } = useMapOverlays();

  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [sidePanel, setSidePanel] = useState('filters');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (location.state?.school) {
      performSearch(location.state.school);
    }
  }, [location.state, performSearch]);

  const handleSearch = (school) => {
    navigate('/search', { state: { school }, replace: true });
  };

  const selectedBlock = blocks.find(b => b.block_id === selectedBlockId);
  const goldCount = blocks.filter(b => b.zone === 'GOLD_1KM').length;
  const silverCount = blocks.filter(b => b.zone === 'SILVER_2KM').length;

  return (
    <div className="search-page">
      <div className="search-topbar">
        <SearchBar onSearch={handleSearch} size="small" />
        {selectedSchool && (
          <div className="search-summary">
            <span className="search-school-name">{selectedSchool.official_name}</span>
            <span className="search-stats">
              <span className="stat gold">{goldCount} Gold</span>
              <span className="stat silver">{silverCount} Silver</span>
              <span className="stat total">{blocks.length} total</span>
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="error-banner" style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 16px', fontSize: '14px', borderBottom: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="search-layout">
        <div className="search-map">
          {loading ? (
            <div className="loading-overlay">
              <div className="spinner" />
              <p>Loading zones...</p>
            </div>
          ) : (
            <MapView
              school={selectedSchool}
              blocks={blocks}
              onBlockSelect={setSelectedBlockId}
              heatmapActive={heatmapActive}
              hiddenGemsActive={hiddenGemsActive}
              leaseGuardActive={leaseGuardActive}
              selectedBlockId={selectedBlockId}
            />
          )}
        </div>

        <button
          className="sidebar-toggle-mobile"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? 'Hide panel' : 'Show panel'}
        </button>

        <div className={`search-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-tabs">
            <button className={`sidebar-tab ${sidePanel === 'filters' ? 'active' : ''}`} onClick={() => setSidePanel('filters')}>
              Filters
            </button>
            <button className={`sidebar-tab ${sidePanel === 'ballot' ? 'active' : ''}`} onClick={() => setSidePanel('ballot')}>
              Ballot
            </button>
            <button className={`sidebar-tab ${sidePanel === 'commute' ? 'active' : ''}`} onClick={() => setSidePanel('commute')}>
              Commute
            </button>
          </div>

          <div className="sidebar-content">
            {sidePanel === 'filters' && (
              <>
                <FilterPanel
                  onApplyFilter={applyFilters}
                  onClearFilters={clearFilters}
                  resultCount={blocks.length}
                />
                <HiddenGems active={hiddenGemsActive} onToggle={toggleHiddenGems} />
                <Heatmap active={heatmapActive} onToggle={toggleHeatmap} />
                <LeaseGuard active={leaseGuardActive} onToggle={toggleLeaseGuard} />
              </>
            )}

            {sidePanel === 'ballot' && selectedSchool && (
              <BallotRisk schoolId={selectedSchool.school_id} schoolName={selectedSchool.official_name} />
            )}

            {sidePanel === 'commute' && (
              <CommuteOptimizer schoolName={selectedSchool?.official_name} />
            )}
          </div>

          {selectedBlockId && (
            <TrendChart
              blockId={selectedBlockId}
              blockInfo={selectedBlock}
              onClose={() => setSelectedBlockId(null)}
            />
          )}

          {selectedSchool && (
            <div className="sidebar-cta">
              <button
                className="btn btn-primary btn-full"
                onClick={() => navigate('/watchlist', { state: { school: selectedSchool } })}
              >
                Add to watchlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
