import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import '../styles/index.css';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return '#10b981';
    case 'in_progress': return '#f59e0b';
    case 'failed': return '#ef4444';
    case 'pending': return '#6b7280';
    default: return 'gray';
  }
};

const Settings = () => {
  const { user } = useAuth();
  const { get, post } = useAPI();
  const [scans, setScans] = useState([]);
  const [monitoringLoading, setMonitoringLoading] = useState(true);
  const [scansPerMinute, setScansPerMinute] = useState(0);
  const [settings, setSettings] = useState({ organization: '', role: 'user' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchRecentScans = useCallback(async () => {
    try {
      const data = await get('/api/scans/');
      const list = Array.isArray(data) ? data : data.results || [];
      setScans(list);
      const lastMinute = list.filter(s => {
        const created = new Date(s.created_at).getTime();
        return Date.now() - created < 60000;
      });
      setScansPerMinute(lastMinute.length);
    } catch (e) {
      setError(e.message);
    } finally {
      setMonitoringLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchRecentScans();
    const interval = setInterval(fetchRecentScans, 5000);
    return () => clearInterval(interval);
  }, [fetchRecentScans]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await post('/api/auth/profiles/', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const activeScans = scans.filter(s => s.status === 'in_progress' || s.status === 'pending');
  const completedScans = scans.filter(s => s.status === 'completed');
  const failedScans = scans.filter(s => s.status === 'failed');

  return (
    <div className="settings-page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>Real-time Monitoring & Settings</h1>
        <p style={{ color: '#6b7280' }}>Monitor scans and manage your account settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '2rem', color: '#f59e0b' }}>{activeScans.length}</h3>
          <p style={{ margin: 0, color: '#4b5563', fontWeight: 500 }}>Active Scans</p>
        </div>
        <div style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '2rem', color: '#10b981' }}>{completedScans.length}</h3>
          <p style={{ margin: 0, color: '#4b5563', fontWeight: 500 }}>Completed</p>
        </div>
        <div style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '2rem', color: '#ef4444' }}>{failedScans.length}</h3>
          <p style={{ margin: 0, color: '#4b5563', fontWeight: 500 }}>Failed</p>
        </div>
        <div style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '2rem', color: '#3b82f6' }}>{scansPerMinute}</h3>
          <p style={{ margin: 0, color: '#4b5563', fontWeight: 500 }}>Scans/min</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', textAlign: 'center' }}>🔄 Live Scan Activity</h2>
          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
          {monitoringLoading ? (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>Loading monitoring data...</p>
          ) : scans.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>No scan activity yet. Start a scan from the Dashboard.</p>
          ) : (
            <div style={{ maxHeight: '320px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
              {scans.slice(0, 50).map(scan => (
                <div key={scan.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <strong style={{ color: '#111827' }}>{scan.target_ip}</strong>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: '0.75rem' }}>{scan.scan_type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getStatusColor(scan.status), display: 'inline-block' }}></span>
                    <span style={{ color: getStatusColor(scan.status), fontWeight: 600, textTransform: 'capitalize', fontSize: '0.875rem' }}>
                      {scan.status.replace('_', ' ')}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      {new Date(scan.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>Account Information</h2>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>Username</label>
            <input type="text" value={user?.username || ''} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', color: '#6b7280' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>Email</label>
            <input type="email" value={user?.email || ''} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', color: '#6b7280' }} />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>Organization</h2>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="org" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>Organization Name</label>
            <input type="text" id="org" value={settings.organization} onChange={(e) => setSettings({...settings, organization: e.target.value})} placeholder="Enter organization name" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>Role</label>
            <select id="role" value={settings.role} onChange={(e) => setSettings({...settings, role: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem', background: 'white' }}>
              <option value="viewer">Viewer</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#2563eb', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;