import React, { useEffect, useState, useCallback } from 'react';
import { useAPI } from '../hooks/useAPI';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { get } = useAPI();

  // ✅ Stable function with useCallback
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await get('/api/reports/');
      setReports(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [get]);

  // ✅ useEffect depends on fetchReports
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="reports-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Reports</h1>
        <button onClick={fetchReports} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <p>No reports found. Run a scan to generate reports.</p>
        </div>
      ) : (
        <table className="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Scan ID</th>
              <th>Title</th>
              <th>Summary</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>#{report.id}</td>
                <td>{report.scan_id || '-'}</td>
                <td>{report.title || 'Untitled'}</td>
                <td>{report.summary || 'No summary available'}</td>
                <td>{new Date(report.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
