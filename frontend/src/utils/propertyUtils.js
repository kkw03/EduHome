// Heatmap PSF buckets
export const HEATMAP_LEGEND = [
  { label: '< $400/psf', color: '#16a34a', min: 0, max: 400 },
  { label: '$400-$500', color: '#65a30d', min: 400, max: 500 },
  { label: '$500-$600', color: '#d97706', min: 500, max: 600 },
  { label: '$600-$700', color: '#ea580c', min: 600, max: 700 },
  { label: '> $700/psf', color: '#dc2626', min: 700, max: 9999 },
];

export function getHeatmapColor(psf) {
  const bucket = HEATMAP_LEGEND.find(b => psf >= b.min && psf < b.max);
  return bucket ? bucket.color : '#9ca3af';
}

export function getRemainingLease(leaseStartYear) {
  const currentYear = new Date().getFullYear();
  return 99 - (currentYear - leaseStartYear);
}
