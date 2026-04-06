import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { getMarketTrend } from '../services/trendService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function TrendChart({ blockId, blockInfo, onClose }) {
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!blockId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getMarketTrend(blockId)
      .then((data) => {
        if (!cancelled) setTrend(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Failed to load trend data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [blockId]);

  if (!blockId) return null;

  if (loading) {
    return (
      <div className="panel-card trend-panel" style={{ margin: '0 12px 12px' }}>
        <div className="panel-header">
          <h3 className="panel-title">Price trend</h3>
          <button className="panel-close" onClick={onClose}>&times;</button>
        </div>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div className="spinner" />
          <p>Loading trend data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-card trend-panel" style={{ margin: '0 12px 12px' }}>
        <div className="panel-header">
          <h3 className="panel-title">Price trend</h3>
          <button className="panel-close" onClick={onClose}>&times;</button>
        </div>
        <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!trend) return null;

  const data = {
    labels: trend.labels,
    datasets: [
      {
        label: 'Avg PSF ($)',
        data: trend.prices,
        borderColor: '#111',
        backgroundColor: 'rgba(0,0,0,0.03)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        borderWidth: 1.5,
      },
      {
        label: '3M Moving Avg',
        data: trend.movingAvg,
        borderColor: '#999',
        borderDash: [4, 2],
        pointRadius: 0,
        borderWidth: 1,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 8, padding: 12, font: { size: 11, family: 'Inter, sans-serif' } },
      },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        ticks: { font: { size: 10, family: 'Inter, sans-serif' }, color: '#999' },
        grid: { display: false },
      },
      y: {
        ticks: { font: { size: 10, family: 'Inter, sans-serif' }, color: '#999' },
        grid: { color: '#f0f0f0' },
        title: { display: true, text: 'PSF ($)', font: { size: 10, family: 'Inter, sans-serif' }, color: '#999' },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="panel-card trend-panel" style={{ margin: '0 12px 12px' }}>
      <div className="panel-header">
        <div>
          <h3 className="panel-title">Price trend</h3>
          {blockInfo && <p className="panel-subtitle">Blk {blockInfo.block_num} {blockInfo.street_name}</p>}
        </div>
        <div className="trend-header-right">
          <span className={`momentum-badge ${trend.momentum === 'Heating Up' ? 'hot' : 'cool'}`}>
            {trend.momentum === 'Heating Up' ? 'Rising' : 'Declining'}
          </span>
          <button className="panel-close" onClick={onClose}>&times;</button>
        </div>
      </div>
      <div className="trend-chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
