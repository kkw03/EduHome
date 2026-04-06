import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getHeatmapColor, getRemainingLease } from '../utils/propertyUtils';

function dot(color, size = 10, border = '#fff', borderWidth = 2) {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${borderWidth}px solid ${border};box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 1.2 });
  return null;
}

export default function MapView({
  school,
  blocks = [],
  schools = [],
  onBlockSelect,
  onSchoolSelect,
  heatmapActive = false,
  hiddenGemsActive = false,
  leaseGuardActive = false,
  selectedBlockId = null,
}) {
  const center = school ? [school.lat, school.lng] : [1.3521, 103.8198];
  const zoom = school ? 15 : 12;

  // Compute hidden gem IDs from blocks: gold blocks with avg_psf < zoneAvg * 0.9
  const goldBlocks = blocks.filter(b => b.zone === 'GOLD_1KM');
  const zoneAvg = goldBlocks.length
    ? goldBlocks.reduce((s, b) => s + b.avg_psf, 0) / goldBlocks.length
    : 0;
  const gemIds = new Set(goldBlocks.filter(b => b.avg_psf < zoneAvg * 0.9).map(b => b.block_id));

  // Compute lease flagged IDs: blocks where remaining lease < 60 years
  const leaseIds = new Set(
    blocks.filter(b => getRemainingLease(b.lease_start_year) < 60).map(b => b.block_id)
  );

  const getBlockColor = (block) => {
    if (heatmapActive) return getHeatmapColor(block.avg_psf);
    if (hiddenGemsActive && gemIds.has(block.block_id)) return '#3b82f6';
    if (leaseGuardActive && leaseIds.has(block.block_id)) return '#ef4444';
    return block.zone === 'GOLD_1KM' ? '#eab308' : '#60a5fa';
  };

  const isSelected = (block) => selectedBlockId === block.block_id;

  const otherSchools = schools.filter(s => !school || s.school_id !== school.school_id);

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* All other schools as subtle dots */}
        {otherSchools.map(s => (
          <Marker
            key={s.school_id}
            position={[s.lat, s.lng]}
            icon={dot('#6366f1', 18, '#fff', 3)}
            eventHandlers={{ click: () => onSchoolSelect && onSchoolSelect(s) }}
          >
            <Tooltip direction="top" offset={[0, -10]} className="map-tooltip">
              <strong>{s.official_name}</strong><br />
              Vacancies: {s.vacancies}
            </Tooltip>
          </Marker>
        ))}

        {/* Selected school zone rings */}
        {school && (
          <>
            <Circle
              center={[school.lat, school.lng]}
              radius={2000}
              pathOptions={{ color: '#60a5fa', fillColor: '#60a5fa', fillOpacity: 0.06, weight: 1.5, dashArray: '6 4' }}
            />
            <Circle
              center={[school.lat, school.lng]}
              radius={1000}
              pathOptions={{ color: '#eab308', fillColor: '#eab308', fillOpacity: 0.08, weight: 1.5, dashArray: '6 4' }}
            />
            <Marker position={[school.lat, school.lng]} icon={dot('#4f46e5', 24, '#fff', 3)}>
              <Tooltip direction="top" offset={[0, -14]} className="map-tooltip">
                <strong>{school.official_name}</strong><br />
                Vacancies: {school.vacancies}
              </Tooltip>
            </Marker>
          </>
        )}

        {/* HDB blocks */}
        {blocks.map(block => {
          const remaining = getRemainingLease(block.lease_start_year);
          const selected = isSelected(block);
          const color = getBlockColor(block);

          return (
            <Marker
              key={block.block_id}
              position={[block.lat, block.lng]}
              icon={dot(color, selected ? 20 : 14, '#fff', selected ? 3 : 2.5)}
              eventHandlers={{ click: () => onBlockSelect && onBlockSelect(block.block_id) }}
            >
              <Tooltip direction="top" offset={[0, -8]} className="map-tooltip">
                <strong>Blk {block.block_num}</strong> {block.street_name}<br />
                ${block.avg_psf}/psf &middot; {remaining} yrs left
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {school && (
        <div className="map-legend">
          <div className="legend-item"><span className="legend-dot" style={{ background: '#4f46e5' }} /> School</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#eab308' }} /> 1 km</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#60a5fa' }} /> 1–2 km</div>
          {hiddenGemsActive && <div className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }} /> Below avg</div>}
          {leaseGuardActive && <div className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} /> Lease risk</div>}
        </div>
      )}
    </div>
  );
}
