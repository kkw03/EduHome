import api from './api';
import { transformBlock } from './searchService';

/**
 * Apply budget, area, and lease filters to blocks via backend.
 * POST /api/filter  { blocks, maxBudget, minArea, childStartYear }
 *
 * Reverse-transforms frontend lat/lng → backend latitude/longitude before sending,
 * then transforms response blocks back to lat/lng.
 */
export async function applyFilters(blocks, { maxBudget, minArea, childStartYear }) {
  // Convert frontend blocks (lat/lng) to backend shape (latitude/longitude)
  const backendBlocks = blocks.map(({ lat, lng, ...rest }) => ({
    ...rest,
    latitude: lat,
    longitude: lng,
  }));

  const { data } = await api.post('/filter', {
    blocks: backendBlocks,
    maxBudget: maxBudget || undefined,
    minArea: minArea || undefined,
    childStartYear: childStartYear || undefined,
  });

  return (data.blocks || []).map(transformBlock);
}
