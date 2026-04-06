import api from './api';

export async function getWatchlist() {
  const { data } = await api.get('/watchlist');
  return data.watchlist;
}

export async function addWatchlistItem(schoolId, minBudget, maxBudget) {
  const { data } = await api.post('/watchlist', {
    school_id: schoolId,
    min_budget: minBudget,
    max_budget: maxBudget,
  });
  return data.watch_item;
}

export async function removeWatchlistItem(watchId) {
  await api.delete(`/watchlist/${watchId}`);
}
