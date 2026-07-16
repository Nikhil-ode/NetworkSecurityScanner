import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useScans } from '../hooks/useScans';
import ScanForm from './ScanForm';
import ScanResults from './ScanResults';
import '../styles/index.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { scans, loading, error, refreshScans } = useScans();
  const [selectedScan, setSelectedScan] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => refreshScans(), 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshScans]);

  const handleScanCreated = (newScan) => {
    setSelectedScan(newScan);
    refreshScans();
  };

  // Update selectedScan details in real-time when scans list updates
  useEffect(() => {
    if (selectedScan) {
      const updated = scans.find(s => s.id === selectedScan.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedScan)) {
        setSelectedScan(updated);
      }
    }
  }, [scans, selectedScan]);

  return (
    <div className="dashboard" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>Network Security Scanner Dashboard</h1>
        {user && <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>Welcome back, {user.username}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <Link to="/scans" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-card" style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.125rem', fontWeight: 600, textAlign: 'center' }}>🔍 Port Scanning</h3>
            <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6, textAlign: 'center' }}>Identify open ports and services on target systems</p>
          </div>
        </Link>
        <Link to="/scans" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-card" style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.125rem', fontWeight: 600, textAlign: 'center' }}>⚠️ Vulnerability Detection</h3>
            <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6, textAlign: 'center' }}>Detect known vulnerabilities and security weaknesses</p>
          </div>
        </Link>
        <Link to="/reports" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-card" style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.125rem', fontWeight: 600, textAlign: 'center' }}>📊 Detailed Reports</h3>
            <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6, textAlign: 'center' }}>Generate comprehensive security reports in multiple formats</p>
          </div>
        </Link>
        <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="feature-card" style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.125rem', fontWeight: 600, textAlign: 'center' }}>🔄 Real-time Monitoring</h3>
            <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6, textAlign: 'center' }}>Track scan progress and view results in real-time</p>
          </div>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', textAlign: 'center' }}>Start New Scan</h2>
          <ScanForm onScanCreated={handleScanCreated} />
        </div>

        {selectedScan && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', textAlign: 'center' }}>Scan Results</h2>
            <ScanResults scan={selectedScan} />
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Recent Scans</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                onClick={refreshScans} 
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '8px', background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer' }}
                disabled={loading}
              >
                Refresh
              </button>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.875rem', color: '#4b5563' }}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Auto-refresh
              </label>
            </div>
          </div>

          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
          
          {loading && !scans.length ? (
            <p style={{ color: '#6b7280' }}>Loading scans...</p>
          ) : scans.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No scans found. Start a new scan above.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target IP</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domain</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr 
                      key={scan.id} 
                      onClick={() => setSelectedScan(scan)}
                      style={{ 
                        cursor: 'pointer', 
                        borderBottom: '1px solid #f3f4f6',
                        background: selectedScan?.id === scan.id ? '#eff6ff' : 'transparent',
                        transition: 'background 0.15s'
                      }}
                    >
                      <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>#{scan.id}</td>
                      <td style={{ padding: '1rem' }}><strong style={{ color: '#111827' }}>{scan.target_ip}</strong></td>
                      <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{scan.target_domain || '-'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: scan.status === 'completed' ? '#d1fae5' : scan.status === 'in_progress' ? '#fef3c7' : scan.status === 'failed' ? '#fee2e2' : '#f3f4f6',
                          color: scan.status === 'completed' ? '#065f46' : scan.status === 'in_progress' ? '#92400e' : scan.status === 'failed' ? '#991b1b' : '#374151',
                          textTransform: 'capitalize',
                          letterSpacing: '0.025em'
                        }}>
                          {scan.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(scan.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
