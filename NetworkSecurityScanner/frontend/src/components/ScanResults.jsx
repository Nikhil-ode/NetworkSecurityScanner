import React, { useEffect, useState, useCallback } from 'react';
import { useAPI } from '../hooks/useAPI';

const ScanResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { get } = useAPI();

  // ✅ Stable function with useCallback
  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await get('/scan-results/');
      setResults(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to load results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [get]);

  // ✅ useEffect depends on fetchResults
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // ✅ Severity color helper
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // orange
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="scan-results-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Scan Results</h1>
        <button onClick={fetchResults} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading results...</p>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <p>No results found. Run a scan to generate results.</p>
        </div>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Scan ID</th>
              <th>Severity</th>
              <th>Description</th>
              <th>Detected At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>#{result.id}</td>
                <td>{result.scan_id || '-'}</td>
                <td style={{ color: getSeverityColor(result.severity), fontWeight: 'bold' }}>
                  {result.severity || 'N/A'}
                </td>
                <td>{result.description || 'No description'}</td>
                <td>{result.detected_at ? new Date(result.detected_at).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScanResults;
