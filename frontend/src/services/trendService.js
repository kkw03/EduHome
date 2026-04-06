import api from './api';

/**
 * Get market trend data for a block.
 * GET /api/trend/<blockId>
 * Response: { labels, prices, moving_avg, momentum }
 * Returns: { labels, prices, movingAvg, momentum }
 */
export async function getMarketTrend(blockId) {
  const { data } = await api.get(`/trend/${blockId}`);

  return {
    labels: data.labels,
    prices: data.prices,
    movingAvg: data.moving_avg,
    momentum: data.momentum,
  };
}
