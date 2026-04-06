import React, { useState, useEffect } from 'react';
import { getBallotRisk } from '../services/ballotRiskService';

export default function BallotRisk({ schoolId, schoolName }) {
  const [showDetail, setShowDetail] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!schoolId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getBallotRisk(schoolId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Failed to load ballot data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [schoolId]);

  if (!schoolId) return null;

  if (loading) {
    return (
      <div className="panel-card">
        <div className="panel-header">
          <h3 className="panel-title">Ballot risk assessment</h3>
        </div>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div className="spinner" />
          <p>Loading ballot data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-card">
        <div className="panel-header">
          <h3 className="panel-title">Ballot risk assessment</h3>
        </div>
        <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const riskColor = {
    Low: '#16a34a',
    Medium: '#d97706',
    High: '#dc2626',
  };

  const riskBg = {
    Low: '#f0fdf4',
    Medium: '#fffbeb',
    High: '#fef2f2',
  };

  const riskBorder = {
    Low: '#bbf7d0',
    Medium: '#fde68a',
    High: '#fecaca',
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">Ballot risk assessment</h3>
      </div>
      <p className="panel-subtitle">{schoolName}</p>

      <div className="ballot-score">
        <div
          className="ballot-badge"
          style={{ background: riskBg[data.risk], color: riskColor[data.risk], border: `1px solid ${riskBorder[data.risk]}` }}
        >
          {data.risk}
        </div>
        <div className="ballot-meter">
          <div className="ballot-meter-fill" style={{ width: `${data.score}%`, background: riskColor[data.risk] }} />
        </div>
        <span className="ballot-score-num">{data.score}/100</span>
      </div>

      <button
        className="btn btn-sm btn-outline"
        onClick={() => setShowDetail(!showDetail)}
        style={{ marginTop: '6px' }}
      >
        {showDetail ? 'Hide details' : 'View details'}
      </button>

      {showDetail && (
        <div className="ballot-detail">
          <div className="ballot-row">
            <span>HDB units within 1km</span>
            <strong>{data.units_1km.toLocaleString()}</strong>
          </div>
          <div className="ballot-row">
            <span>Phase 2C vacancies</span>
            <strong>{data.vacancies}</strong>
          </div>
          <div className="ballot-row">
            <span>Applicant-to-vacancy ratio</span>
            <strong>{data.ratio.toFixed(1)}:1</strong>
          </div>
          <p className="ballot-note">
            {data.risk === 'High'
              ? 'High competition expected. Consider Silver zone blocks as alternatives.'
              : data.risk === 'Medium'
              ? 'Moderate competition. Prepare for possible balloting.'
              : 'Low competition. Most 1km applicants should secure placement.'}
          </p>
        </div>
      )}
    </div>
  );
}
