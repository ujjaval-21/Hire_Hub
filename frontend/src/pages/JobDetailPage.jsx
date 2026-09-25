import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { useSavedJobs } from '../hooks/useSavedJobs';
import SaveJobButton from '../components/SaveJobButton';

function JobDetailPage() {
  const { jobId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [myResumes, setMyResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const { savedJobIds, toggleSave, isCandidate } = useSavedJobs();

  useEffect(() => {
    apiClient.get(`/jobs/${jobId}/`).then((res) => setJob(res.data));
    if (currentUser?.role === 'candidate') {
      apiClient.get('/applications/resumes/').then((res) => setMyResumes(res.data));
    }
  }, [jobId, currentUser]);

  const handleApply = async () => {
    setStatusMessage('');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!selectedResumeId) {
      setStatusMessage('Please select a resume first.');
      return;
    }
    try {
      await apiClient.post('/applications/apply/', { job: jobId, resume: selectedResumeId });
      setStatusMessage('Application submitted successfully!');
    } catch (error) {
      const detail = error.response?.data?.non_field_errors?.[0]
        || error.response?.data?.detail
        || 'Failed to apply. You may have already applied.';
      setStatusMessage(detail);
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="card">
      <div className="job-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>{job.title}</h2>
          <div className="job-detail-meta">
            <strong>{job.company_name}</strong>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span className="job-type-badge">{job.job_type.replace('_', ' ')}</span>
          </div>
          {(job.salary_min || job.salary_max) && (
            <p className="card-meta">Salary: {job.salary_min} - {job.salary_max}</p>
          )}
        </div>
        <SaveJobButton jobId={job.id} savedJobIds={savedJobIds} toggleSave={toggleSave} isCandidate={isCandidate} />
      </div>

      <p className="job-detail-description">{job.description}</p>

      {currentUser?.role === 'candidate' && (
        <div className="apply-box">
          <h3>Apply for this job</h3>
          {myResumes.length === 0 ? (
            <p className="card-meta">You need to upload a resume first (from your Profile).</p>
          ) : (
            <>
              <select value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)}>
                <option value="">Select a resume</option>
                {myResumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>{resume.original_filename}</option>
                ))}
              </select>
              <button onClick={handleApply}>Apply</button>
            </>
          )}
          {statusMessage && <p style={{ marginTop: '0.6rem' }}>{statusMessage}</p>}
        </div>
      )}

      {!currentUser && (
        <div className="apply-box">
          <p className="card-meta">
            <a href="/login">Log in</a> as a candidate to apply for this job.
          </p>
        </div>
      )}
    </div>
  );
}

export default JobDetailPage;