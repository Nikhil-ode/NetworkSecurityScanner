import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';

const SCANS_ENDPOINT = '/api/scans/';

export const useScans = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(SCANS_ENDPOINT);
      const scansData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setScans(scansData);
    } catch (err) {
      console.error('Error fetching scans:', err);
      setError(err.message);
      setScans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const createScan = useCallback(async (scanData) => {
    try {
      const response = await apiClient.post(SCANS_ENDPOINT, scanData);
      setScans(prevScans => [response.data, ...prevScans]);
      return response.data;
    } catch (err) {
      console.error('Error creating scan:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  const refreshScans = useCallback(async () => {
    await fetchScans();
  }, []);

  return { scans, loading, error, fetchScans, createScan, refreshScans };
};
