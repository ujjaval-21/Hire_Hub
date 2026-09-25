import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Briefcase, Pencil, Users, Pause, Play } from 'lucide-react';

function MyJobPostingsPage() {
  const [myJobs, setMyJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const [editingJobId, setEditingJobId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    apiClient.get('/jobs/mine/').then((res) => {
      setMyJobs(res.data);
      setIsLoading(false);
    });
  }, []);

  const toggleJobApplicants = async (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }
    setExpandedJobId(jobId);
    setEditingJobId(null);
    setApplicantsLoading(true);
    try {
      const response = await apiClient.get(`/applications/job/${jobId}/`);
      setJobApplicants(response.data);
    } catch (error) {
      setJobApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await apiClient.patch(`/applications/${applicationId}/status/`, { status: newStatus });
      setJobApplicants((current) =>
        current.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const handleToggleHiring = async (job) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      const response = await apiClient.patch(`/jobs/${job.id}/`, { status: newStatus });
      setMyJobs((current) => current.map((j) => (j.id === job.id ? response.data : j)));
    } catch (error) {
      alert('Failed to update job status.');
    }
  };

  const startEditing = (job) => {
    setEditingJobId(job.id);
    setExpandedJobId(null);
    setEditFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      job_type: job.job_type,
      salary_min: job.salary_min || '',
      salary_max: job.salary_max || '',
    });
  };

  const handleEditChange = (event) => {
    setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
  };

  const handleSaveEdit = async (jobId) => {
    try {
      const response = await apiClient.patch(`/jobs/${jobId}/`, editFormData);
      setMyJobs((current) => current.map((j) => (j.id === jobId ? response.data : j)));
      setEditingJobId(null);
    } catch (error) {
      alert('Failed to save changes.');
    }
  };

  return (
    <div>
      <h2 className="page-title">My Job Postings</h2>

      {isLoading && <p>Loading...</p>}

      {!isLoading && myJobs.length === 0 && (
        <div className="empty-state">
          <p>You haven't posted any jobs yet.</p>
          <Link to="/post-job">Post your first job →</Link>
        </div>
      )}

      {myJobs.map((job) => (
        <div key={job.id} className="card">
          {editingJobId === job.id ? (
            <div className="job-edit-form">
              <div className="form-full">
                <label>Title</label>
                <input name="title" value={editFormData.title} onChange={handleEditChange} />
              </div>
              <div className="form-full">
                <label>Description</label>
                <textarea name="description" value={editFormData.description} onChange={handleEditChange} />
              </div>
              <div className="form-row">
                <div>
                  <label>Location</label>
                  <input name="location" value={editFormData.location} onChange={handleEditChange} />
                </div>
                <div>
                  <label>Job Type</label>
                  <select name="job_type" value={editFormData.job_type} onChange={handleEditChange}>
                    <option value="full_time">Full-Time</option>
                    <option value="part_time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label>Salary Min</label>
                  <input type="number" name="salary_min" value={editFormData.salary_min} onChange={handleEditChange} />
                </div>
                <div>
                  <label>Salary Max</label>
                  <input type="number" name="salary_max" value={editFormData.salary_max} onChange={handleEditChange} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={() => handleSaveEdit(job.id)}>Save Changes</button>
                <button className="btn-secondary" onClick={() => setEditingJobId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="job-posting-header">
                <div className="job-card-icon">
                  <Briefcase size={20} />
                </div>
                <div className="job-card-main">
                  <h3>{job.title}</h3>
                  <p className="card-meta">{job.location} — {job.job_type.replace('_', ' ')}</p>
                </div>
                <span className={`status-badge ${job.status === 'open' ? 'status-shortlisted' : 'status-rejected'}`}>
                  {job.status}
                </span>
              </div>

              <div className="job-posting-actions">
                <button className="btn-secondary" onClick={() => toggleJobApplicants(job.id)}>
                  <Users size={15} /> {expandedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
                </button>
                <button className="btn-secondary" onClick={() => startEditing(job)}>
                  <Pencil size={15} /> Edit
                </button>
                <button className="btn-secondary" onClick={() => handleToggleHiring(job)}>
                  {job.status === 'open' ? <Pause size={15} /> : <Play size={15} />}
                  {job.status === 'open' ? 'Stop Hiring' : 'Resume Hiring'}
                </button>
              </div>

              {expandedJobId === job.id && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  {applicantsLoading && <p>Loading applicants...</p>}
                  {!applicantsLoading && jobApplicants.length === 0 && (
                    <p className="card-meta">No applications yet.</p>
                  )}
                  {!applicantsLoading &&
                    jobApplicants.map((application) => (
                      <div key={application.id} className="applicant-row">
                        <p style={{ margin: 0 }}><strong>{application.candidate_username}</strong></p>
                        <p className="card-meta" style={{ margin: '0.2rem 0' }}>
                          Applied: {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                        <a href={application.resume_file} target="_blank" rel="noreferrer">View Resume</a>
                        <div style={{ marginTop: '0.5rem' }}>
                          <select
                            value={application.status}
                            onChange={(e) => handleStatusChange(application.id, e.target.value)}
                          >
                            <option value="applied">Applied</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyJobPostingsPage;