import React, { useEffect, useState, useCallback } from 'react';
import { useAPI } from '../hooks/useAPI';

const ScanResults = ({ scan }) => {
  const [result, setResult] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { get } = useAPI();

  const fetchResults = useCallback(async () => {
    if (!scan || !scan.id) return;
    setLoading(true);
    setError('');
    try {
      // Fetch scan result details
      const data = await get(`/scans/${scan.id}/`);
      
      // Fetch vulnerabilities for this scan
      const vulns = await get(`/vulnerabilities/?scan=${scan.id}`);
      setVulnerabilities(Array.isArray(vulns) ? vulns : vulns.results || []);

      // Fetch detailed scan result data
      try {
        const resData = await get(`/scans/${scan.id}/result/`);
        setResult(resData);
      } catch (e) {
        // Result might not be created yet if scan is in progress
        setResult(null);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, [get, scan]);

  useEffect(() => {
    fetchResults();
    
    // If scan is in progress, poll every 3 seconds for real-time updates
    if (scan && (scan.status === 'pending' || scan.status === 'in_progress')) {
      const interval = setInterval(fetchResults, 3000);
      return () => clearInterval(interval);
    }
  }, [fetchResults, scan]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return '#7f1d1d'; // dark red
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // orange
      case 'low':
        return '#10b981'; // green
      case 'info':
      default:
        return '#6b7280'; // gray
    }
  };

  if (!scan) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
        <p>Select a scan from the list below to view real-time details.</p>
      </div>
    );
  }

  return (
    <div className="scan-results-section" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Scan Details for #{scan.id}</h3>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Target: <strong>{scan.target_ip}</strong> {scan.target_domain && `(${scan.target_domain})`}
          </p>
        </div>
        <span style={{
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: scan.status === 'completed' ? '#d1fae5' : scan.status === 'in_progress' ? '#fef3c7' : scan.status === 'failed' ? '#fee2e2' : '#f3f4f6',
          color: scan.status === 'completed' ? '#065f46' : scan.status === 'in_progress' ? '#92400e' : scan.status === 'failed' ? '#991b1b' : '#374151',
          textTransform: 'capitalize'
        }}>
          {scan.status.replace('_', ' ')}
        </span>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

      {scan.status === 'in_progress' && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#4b5563' }}>
          <div className="spinner" style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ fontWeight: 500 }}>Scan is running in real-time...</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Checking open ports, services, and vulnerabilities. Please wait.</p>
        </div>
      )}

      {scan.status === 'failed' && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          <p style={{ fontWeight: 600 }}>Scan Failed</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>There was an error executing this scan. Please check the target IP/domain and try again.</p>
        </div>
      )}

      {scan.status === 'completed' && (
        <div>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
                {result?.open_ports?.length || 0}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Open Ports</span>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
                {result?.services?.length || 0}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Services Detected</span>
            </div>
            <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fee2e2', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#b91c1c' }}>
                {vulnerabilities.length}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#b91c1c', textTransform: 'uppercase', fontWeight: 600 }}>Vulnerabilities</span>
            </div>
          </div>

          {/* Open Ports & Services */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Detected Ports & Services</h4>
            {result?.services && result.services.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: '#4b5563' }}>Port</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: '#4b5563' }}>Service</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: '#4b5563' }}>Banner / Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.services.map((svc, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600, color: '#111827' }}>{svc.port}/TCP</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#4b5563', textTransform: 'uppercase', fontSize: '0.8rem' }}>{svc.service}</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>{svc.banner || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>No open ports detected.</p>
            )}
          </div>

          {/* Vulnerabilities */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Security Vulnerabilities</h4>
            {vulnerabilities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {vulnerabilities.map((vuln) => (
                  <div key={vuln.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>{vuln.title}</h5>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: vuln.severity === 'critical' || vuln.severity === 'high' ? '#fee2e2' : vuln.severity === 'medium' ? '#fef3c7' : '#d1fae5',
                        color: vuln.severity === 'critical' || vuln.severity === 'high' ? '#991b1b' : vuln.severity === 'medium' ? '#92400e' : '#065f46'
                      }}>
                        {vuln.severity}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5 }}>{vuln.description}</p>
                    {vuln.remediation && (
                      <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid #3b82f6', fontSize: '0.8rem', color: '#374151' }}>
                        <strong>Remediation:</strong> {vuln.remediation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#10b981', fontStyle: 'italic', fontWeight: 500 }}>No vulnerabilities detected! System appears secure.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanResults;
