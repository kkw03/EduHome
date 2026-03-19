import React from 'react';
import { HEATMAP_LEGEND } from '../data/dummyData';

export default function Heatmap({ active, onToggle }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">PSF heatmap</h3>
        <button className={`toggle-btn ${active ? 'active' : ''}`} onClick={onToggle}>
          {active ? 'On' : 'Off'}
        </button>
      </div>
      <p className="panel-desc">Colour-coded price overlay by PSF range</p>

      {active && (
        <div className="heatmap-legend">
          {HEATMAP_LEGEND.map((bucket, i) => (
            <div key={i} className="heatmap-legend-item">
              <span className="heatmap-swatch" style={{ background: bucket.color }} />
              <span>{bucket.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
