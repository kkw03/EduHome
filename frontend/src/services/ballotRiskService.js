import api from './api';

/**
 * Get ballot risk summary for a school.
 * GET /api/ballot-risk/<schoolId>
 * Response: { risk, score, units_1km, vacancies, ratio }
 */
export async function getBallotRisk(schoolId) {
  const { data } = await api.get(`/ballot-risk/${schoolId}`);
  return data;
}

/**
 * Get detailed ballot risk breakdown for a school.
 * GET /api/ballot-risk/<schoolId>/detail
 * Response: { risk, score, units_1km, vacancies, ratio }
 */
export async function getBallotRiskDetail(schoolId) {
  const { data } = await api.get(`/ballot-risk/${schoolId}/detail`);
  return data;
}
