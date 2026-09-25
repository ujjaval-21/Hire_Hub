import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

export function useSavedJobs() {
  const { currentUser } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  useEffect(() => {
    if (currentUser?.role === 'candidate') {
      apiClient.get('/jobs/saved/').then((res) => {
        setSavedJobIds(new Set(res.data.map((s) => s.job)));
      });
    }
  }, [currentUser]);

  const toggleSave = useCallback(async (jobId) => {
    if (savedJobIds.has(jobId)) {
      await apiClient.delete(`/jobs/saved/${jobId}/`);
      setSavedJobIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    } else {
      await apiClient.post('/jobs/saved/', { job: jobId });
      setSavedJobIds((prev) => new Set(prev).add(jobId));
    }
  }, [savedJobIds]);

  return { savedJobIds, toggleSave, isCandidate: currentUser?.role === 'candidate' };
}