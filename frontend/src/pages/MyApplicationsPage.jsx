import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const STATUS_FILTERS = ['all', 'applied', 'reviewed', 'shortlisted', 'rejected', 'hired'];

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    apiClient.get('/applications/mine/').then((res) => {
      setApplications(res.data);
      setIsLoading(false);
    });
  }, []);

  const filteredApplications = activeFilter === 'all'
    ? applications
    : applications.filter((app) => app.status === activeFilter);

  const countFor = (status) =>
    status === 'all' ? applications.length : applications.filter((app) => app.status === status).length;

  return (
    <div>
      <h2 className="page-title">My Applications</h2>

      <div className="filter-tabs">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            className={`filter-tab ${activeFilter === status ? 'filter-tab-active' : ''}`}
            onClick={() => setActiveFilter(status)}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="filter-tab-count">{countFor(status)}</span>
          </button>
        ))}
      </div>

      {isLoading && <p>Loading...</p>}

      {!isLoading && filteredApplications.length === 0 && (
        <div className="empty-state">
          <p>No applications {activeFilter !== 'all' ? `with status "${activeFilter}"` : 'yet'}.</p>
          {applications.length === 0 && <Link to="/browse-jobs">Browse open jobs →</Link>}
        </div>
      )}

      {filteredApplications.map((application) => (
        <div key={application.id} className="card application-card">
          <div>
            <h3><Link to={`/jobs/${application.job}`}>{application.job_title}</Link></h3>
            <p className="card-meta">
              {application.company_name} — {application.job_location} — {application.job_type?.replace('_', ' ')}
            </p>
            <p className="card-meta">Applied {new Date(application.applied_at).toLocaleDateString()}</p>
          </div>
          <span className={`status-badge status-${application.status}`}>{application.status}</span>
        </div>
      ))}
    </div>
  );
}

export default MyApplicationsPage;