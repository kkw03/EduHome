import api from './api';

export async function getCommuteRoute(schoolId, topN = 3) {
  const { data } = await api.post('/commute', {
    school_id: schoolId,
    top_n: topN,
  });
  return data.alternative_blocks;
}
