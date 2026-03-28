import { useState, useCallback } from 'react';

export default function useMapOverlays() {
  const [heatmapActive, setHeatmapActive] = useState(false);
  const [hiddenGemsActive, setHiddenGemsActive] = useState(false);
  const [leaseGuardActive, setLeaseGuardActive] = useState(false);

  const toggleHeatmap = useCallback(() => {
    setHeatmapActive(prev => !prev);
  }, []);

  const toggleHiddenGems = useCallback(() => {
    setHiddenGemsActive(prev => !prev);
  }, []);

  const toggleLeaseGuard = useCallback(() => {
    setLeaseGuardActive(prev => !prev);
  }, []);

  const clearOverlays = useCallback(() => {
    setHeatmapActive(false);
    setHiddenGemsActive(false);
    setLeaseGuardActive(false);
  }, []);

  return {
    heatmapActive,
    hiddenGemsActive,
    leaseGuardActive,
    toggleHeatmap,
    toggleHiddenGems,
    toggleLeaseGuard,
    clearOverlays,
  };
}
