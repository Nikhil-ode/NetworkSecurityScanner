import { useCallback } from 'react';
import apiClient from '../services/api';

export const useAPI = () => {
  const get = useCallback(async (endpoint) => {
    const response = await apiClient.get(endpoint);
    return response.data;
  }, []);

  const post = useCallback(async (endpoint, data) => {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  }, []);

  const put = useCallback(async (endpoint, data) => {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  }, []);

  const patch = useCallback(async (endpoint, data) => {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
  }, []);

  const delete_ = useCallback(async (endpoint) => {
    const response = await apiClient.delete(endpoint);
    return response.data;
  }, []);

  return { get, post, put, patch, delete: delete_ };
};
