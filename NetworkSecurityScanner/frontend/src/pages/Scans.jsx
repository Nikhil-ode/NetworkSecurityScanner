import React, { useEffect, useState, useCallback } from 'react';
import { useAPI } from '../hooks/useAPI';

const Scans = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { get } = useAPI();

  // ✅ Wrap fetchScans in useCallback so it's stable
  const fetchScans = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await get('/api/scans/');
      setScans(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching scans:', error);
      setError(error.message || 'Failed to load scans');
      setScans([]);
    } finally {
      setLoading(false);
    }
  }, [get]); // dependency: get

  useEffect(() => {
    fetchScans();
  }, [fetchScans]); // ✅ dependency added

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      case 'pending':
        return '#6b7280';
      default:
        return 'gray';
    }
  };

  return (
    <div className="scans-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Scans</h1>
        <button onClick={fetchScans} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading scans...</p>
      ) : scans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <p>No scans found. Go to the dashboard to start a new scan.</p>
        </div>
      ) : (
        <table className="scans-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Target IP</th>
              <th>Domain</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id}>
                <td>#{scan.id}</td>
                <td><strong>{scan.target_ip}</strong></td>
                <td>{scan.target_domain || '-'}</td>
                <td>{scan.scan_type}</td>
                <td>
                  <span style={{ 
                    color: getStatusColor(scan.status),
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {scan.status.replace('_', ' ')}
                  </span>
                </td>
                <td>{new Date(scan.created_at).toLocaleDateString()}</td>
                <td>
                  {scan.completed_at
                    ? new Date(scan.completed_at).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Scans;
