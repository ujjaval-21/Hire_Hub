import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

function DashboardPage() {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myResumes, setMyResumes] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const [expandedJobId, setExpandedJobId] = useState(null);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'employer') {
      apiClient.get('/jobs/mine/').then((res) => setMyJobs(res.data));
    }
    if (currentUser?.role === 'candidate') {
      apiClient.get('/applications/mine/').then((res) => setMyApplications(res.data));
      apiClient.get('/applications/resumes/').then((res) => setMyResumes(res.data));
      apiClient.get('/notifications/').then((res) => setNotifications(res.data));
    }

  }, [currentUser]);

  const handleResumeUpload = async (event) => {
    event.preventDefault();
    if (!resumeFile) return;

    const uploadData = new FormData();
    uploadData.append('file', resumeFile);

    try {
      const response = await apiClient.post('/applications/resumes/', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMyResumes([response.data, ...myResumes]);
      setUploadMessage('Resume uploaded successfully!');
      setResumeFile(null);
    } catch (error) {
      setUploadMessage('Upload failed.');
    }
  };

  const toggleJobApplicants = async (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }
    setExpandedJobId(jobId);
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


  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read/`, { is_read: true });
      setNotifications((current) =>
        current.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };



  if (!currentUser) return <p>Please log in to view your dashboard.</p>;

  return (
    <div className="page-container">
      <h2>Dashboard</h2>

      {currentUser.role === 'employer' && (
        <div>
          <h3>My Job Postings</h3>
          {myJobs.length === 0 && <p>You haven't posted any jobs yet.</p>}
          {myJobs.map((job) => (
            <div key={job.id} className="card">
              <h3>{job.title}</h3>
              <p className="card-meta">Status: {job.status}</p>
              <button onClick={() => toggleJobApplicants(job.id)}>
                {expandedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
              </button>

              {expandedJobId === job.id && (
                <div style={{ marginTop: '1rem' }}>
                  {applicantsLoading && <p>Loading applicants...</p>}
                  {!applicantsLoading && jobApplicants.length === 0 && (
                    <p className="card-meta">No applications yet.</p>
                  )}
                  {!applicantsLoading &&
                    jobApplicants.map((application) => (
                      <div
                        key={application.id}
                        style={{
                          borderTop: '1px solid var(--color-border)',
                          paddingTop: '0.7rem',
                          marginTop: '0.7rem',
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          <strong>{application.candidate_username}</strong>
                        </p>
                        <p className="card-meta" style={{ margin: '0.2rem 0' }}>
                          Applied: {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                        <a href={application.resume_file} target="_blank" rel="noreferrer">
                          View Resume
                        </a>
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
            </div>
          ))}
        </div>
      )}

      {currentUser.role === 'candidate' && (
        <div>
          <h3>My Resumes</h3>
          <form onSubmit={handleResumeUpload}>
            <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} />
            <button type="submit">Upload Resume</button>
          </form>
          {uploadMessage && <p className="success-text">{uploadMessage}</p>}
          <ul>
            {myResumes.map((resume) => (
              <li key={resume.id}>{resume.original_filename}</li>
            ))}
          </ul>

          <h3>My Applications</h3>
          {myApplications.length === 0 && <p>You haven't applied to any jobs yet.</p>}
          {myApplications.map((application) => (
            <div key={application.id} className="card">
              <h3>{application.job_title}</h3>
              <span className="status-badge">{application.status}</span>
            </div>
          ))}

          <h3>Notifications</h3>
          {notifications.length === 0 && <p className="card-meta">No notifications yet.</p>}
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="card"
              style={{ opacity: notification.is_read ? 0.6 : 1 }}
            >
              <p style={{ margin: 0 }}>{notification.message}</p>
              <p className="card-meta" style={{ margin: '0.3rem 0' }}>
                {new Date(notification.created_at).toLocaleString()}
              </p>
              {!notification.is_read && (
                <button onClick={() => handleMarkAsRead(notification.id)}>Mark as read</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;