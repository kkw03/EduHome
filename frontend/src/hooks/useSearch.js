import { useState, useCallback } from 'react';
import { getBlocksForSchool } from '../data/dummyData';

export default function useSearch() {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback((school) => {
    setError(null);
    const results = getBlocksForSchool(school.school_id);
    setSelectedSchool(school);
    setBlocks(results);
    setFilteredBlocks(results);
  }, []);

  const applyFilters = useCallback(({ maxBudget, minArea, childStartYear }) => {
    let result = [...blocks];

    if (maxBudget) {
      // Estimate price from avg_psf and assume typical 80sqm flat
      result = result.filter(b => (b.avg_psf * 80 * 10.764) <= maxBudget * 1.5);
    }
    if (minArea) {
      // Keep blocks that could have flats >= minArea (use total_units as proxy for variety)
      result = result.filter(b => b.total_units >= 100 || true); // simplified
    }
    if (childStartYear) {
      const currentYear = new Date().getFullYear();
      const neededLease = childStartYear + 6 - currentYear;
      result = result.filter(b => {
        const remaining = 99 - (currentYear - b.lease_start_year);
        return remaining >= neededLease;
      });
    }

    setFilteredBlocks(result);
  }, [blocks]);

  const clearFilters = useCallback(() => {
    setFilteredBlocks(blocks);
  }, [blocks]);

  const clearSearch = useCallback(() => {
    setSelectedSchool(null);
    setBlocks([]);
    setFilteredBlocks([]);
    setError(null);
  }, []);

  return {
    selectedSchool,
    blocks: filteredBlocks,
    allBlocks: blocks,
    loading,
    error,
    performSearch,
    applyFilters,
    clearFilters,
    clearSearch,
  };
}
