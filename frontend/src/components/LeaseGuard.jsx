import React from 'react';
import { getRemainingLease } from '../utils/propertyUtils';

export default function LeaseGuard({ active, onToggle, schoolId, blocks = [], childStartYear }) {
  const requiredYears = childStartYear ? (childStartYear + 6 - new Date().getFullYear()) : 30;
  const flagged = blocks.filter(b => getRemainingLease(b.lease_start_year) < requiredYears);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">Lease check</h3>
        <button className={`toggle-btn ${active ? 'active' : ''}`} onClick={onToggle}>
          {active ? 'On' : 'Off'}
        </button>
      </div>
      <p className="panel-desc">
        Flags blocks with insufficient remaining lease
        {childStartYear && <> (need {requiredYears}+ yrs)</>}
      </p>

      {active && (
        <div className="lease-list">
          {flagged.length === 0 ? (
            <p className="empty-msg success-msg">All leases sufficient</p>
          ) : (
            flagged.map(b => {
              const remaining = getRemainingLease(b.lease_start_year);
              return (
                <div key={b.block_id} className="lease-item">
                  <div className="lease-info">
                    <strong>Blk {b.block_num}</strong> {b.street_name}
                  </div>
                  <div className="lease-detail">
                    <span className="lease-years">{remaining} yrs</span>
                    <span className="lease-start">from {b.lease_start_year}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
