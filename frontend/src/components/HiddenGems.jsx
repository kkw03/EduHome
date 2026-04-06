import React from 'react';

export default function HiddenGems({ active, onToggle, schoolId, blocks = [] }) {
  const goldBlocks = blocks.filter(b => b.zone === 'GOLD_1KM');
  const zoneAvgPSF = goldBlocks.length
    ? Math.round(goldBlocks.reduce((s, b) => s + b.avg_psf, 0) / goldBlocks.length)
    : 0;
  const gems = goldBlocks.filter(b => b.avg_psf < zoneAvgPSF * 0.9);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">Below-average PSF</h3>
        <button className={`toggle-btn ${active ? 'active' : ''}`} onClick={onToggle}>
          {active ? 'On' : 'Off'}
        </button>
      </div>
      <p className="panel-desc">Blocks below zone average of ${zoneAvgPSF}/psf</p>

      {active && (
        <div className="gem-list">
          {gems.length === 0 ? (
            <p className="empty-msg">None found in this zone</p>
          ) : (
            gems.map(b => (
              <div key={b.block_id} className="gem-item">
                <div className="gem-info">
                  <strong>Blk {b.block_num}</strong> {b.street_name}
                </div>
                <div className="gem-psf">
                  <span className="gem-price">${b.avg_psf}/psf</span>
                  <span className="gem-savings">-${zoneAvgPSF - b.avg_psf}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
