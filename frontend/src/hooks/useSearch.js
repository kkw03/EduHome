import { useState, useCallback } from 'react';
import { searchSchoolZone } from '../services/searchService';
import { applyFilters as applyFiltersAPI } from '../services/filterService';

export default function useSearch() {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [allBlocks, setAllBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (school) => {
    setError(null);
    setLoading(true);
    try {
      const { school: schoolData, blocks: resultBlocks } = await searchSchoolZone(school.official_name);
      setSelectedSchool(schoolData);
      setBlocks(resultBlocks);
      setAllBlocks(resultBlocks);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Search failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async ({ maxBudget, minArea, childStartYear }) => {
    setLoading(true);
    setError(null);
    try {
      const filtered = await applyFiltersAPI(allBlocks, { maxBudget, minArea, childStartYear });
      setBlocks(filtered);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Filter failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [allBlocks]);

  const clearFilters = useCallback(() => {
    setBlocks(allBlocks);
  }, [allBlocks]);

  const clearSearch = useCallback(() => {
    setSelectedSchool(null);
    setBlocks([]);
    setAllBlocks([]);
    setError(null);
  }, []);

  return {
    selectedSchool,
    blocks,
    allBlocks,
    loading,
    error,
    performSearch,
    applyFilters,
    clearFilters,
    clearSearch,
  };
}
