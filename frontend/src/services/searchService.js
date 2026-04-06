import api from './api';

/**
 * Fetch all primary schools for autocomplete and map display.
 * GET /api/schools
 */
export async function getSchools() {
  const { data } = await api.get('/schools');
  return data.map(s => ({
    ...s,
    lat: s.latitude,
    lng: s.longitude,
  }));
}

/**
 * Transform a backend block (latitude/longitude) to frontend shape (lat/lng).
 */
export function transformBlock(block) {
  if (!block) return block;
  const { latitude, longitude, ...rest } = block;
  return {
    ...rest,
    lat: latitude ?? block.lat,
    lng: longitude ?? block.lng,
  };
}

/**
 * Search for a school and return merged Gold + Silver blocks.
 * POST /api/search  { school_name }
 * Response: { school: {..., latitude, longitude}, gold: [...], silver: [...] }
 * Returns: { school: {..., lat, lng}, blocks: [...with lat/lng and zone] }
 */
export async function searchSchoolZone(schoolName) {
  const { data } = await api.post('/search', { school_name: schoolName });

  const school = {
    ...data.school,
    lat: data.school.latitude,
    lng: data.school.longitude,
  };

  const goldBlocks = (data.gold || []).map(transformBlock);
  const silverBlocks = (data.silver || []).map(transformBlock);
  const blocks = [...goldBlocks, ...silverBlocks];

  return { school, blocks };
}

/**
 * Get hidden gem blocks for a school.
 * POST /api/search/hidden-gems  { school_name }
 * Response: { blocks: [...with zone_avg_psf, savings_psf] }
 */
export async function getHiddenGems(schoolName) {
  const { data } = await api.post('/search/hidden-gems', { school_name: schoolName });
  return (data.blocks || []).map(transformBlock);
}

/**
 * Get heatmap data for a school's blocks.
 * POST /api/search/heatmap  { school_name }
 * Response: { blocks: [...with heatmap_color] }
 */
export async function getHeatmapData(schoolName) {
  const { data } = await api.post('/search/heatmap', { school_name: schoolName });
  return (data.blocks || []).map(transformBlock);
}
