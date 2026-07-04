import React, { useState } from 'react';
import { useAPI } from '../hooks/useAPI';

const ScanForm = ({ onScanCreated }) => {
  const [targetIp, setTargetIp] = useState('');
  const [targetDomain, setTargetDomain] = useState('');
  const [scanType, setScanType] = useState('full');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { post } = useAPI();

  const validateIP = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    const parts = ip.split('.');
    return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!targetIp.trim()) {
      setError('Target IP address is required');
      return;
    }

    if (!validateIP(targetIp)) {
      setError('Please enter a valid IP address (e.g., 192.168.1.1)');
      return;
    }

    setLoading(true);

    try {
      const data = {
        target_ip: targetIp,
        target_domain: targetDomain || '',
        scan_type: scanType,
      };

      const result = await post('/scans/', data);
      setTargetIp('');
      setTargetDomain('');
      setScanType('full');
      setSuccess('Scan started successfully! You can track progress below.');
      
      if (onScanCreated) {
        onScanCreated(result);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error starting scan:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Error starting scan';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="scan-form">
      <h2>Start New Scan</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-group">
        <label htmlFor="targetIp">Target IP Address *</label>
        <input
          type="text"
          id="targetIp"
          value={targetIp}
          onChange={(e) => setTargetIp(e.target.value)}
          placeholder="192.168.1.1"
          disabled={loading}
          required
        />
        <small>Enter the IP address you want to scan</small>
      </div>

      <div className="form-group">
        <label htmlFor="targetDomain">Target Domain (Optional)</label>
        <input
          type="text"
          id="targetDomain"
          value={targetDomain}
          onChange={(e) => setTargetDomain(e.target.value)}
          placeholder="example.com"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="scanType">Scan Type</label>
        <select
          id="scanType"
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          disabled={loading}
        >
          <option value="full">Full Scan</option>
          <option value="quick">Quick Scan</option>
          <option value="ports">Port Scan Only</option>
          <option value="service">Service Detection</option>
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Starting...' : 'Start Scan'}
      </button>
    </form>
  );
};

export default ScanForm;
