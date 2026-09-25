import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { Search, MapPin, Briefcase } from 'lucide-react';


const STATUS_COLORS = {
  applied: '#2563EB',
  reviewed: '#A16207',
  shortlisted: '#16A34A',
  rejected: '#DC2626',
  hired: '#1D4ED8',
};

function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [heroSearchTerm, setHeroSearchTerm] = useState('');
  const [heroLocation, setHeroLocation] = useState('');

  useEffect(() => {
    if (currentUser?.role === 'employer') {
      apiClient.get('/applications/stats/').then((res) => setStats(res.data));
      apiClient.get('/applications/recent/').then((res) => setRecentActivity(res.data));
      apiClient.get('/jobs/mine/').then((res) => setRecentJobs(res.data.slice(0, 5)));
    } else if (currentUser?.role === 'candidate') {
      apiClient.get('/applications/stats/').then((res) => setStats(res.data));
      apiClient.get('/applications/mine/').then((res) => setRecentActivity(res.data.slice(0, 5)));
      apiClient.get('/jobs/').then((res) => setRecentJobs(res.data.slice(0, 5)));
    } else {
      apiClient.get('/jobs/').then((res) => setRecentJobs(res.data.slice(0, 5)));
    }
  }, [currentUser]);

  const totalForBreakdown = stats
    ? Object.values(stats.status_breakdown || {}).reduce((a, b) => a + b, 0)
    : 0;

  const handleHeroSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (heroSearchTerm) params.set('search', heroSearchTerm);
    if (heroLocation) params.set('location', heroLocation);
    navigate(`/browse-jobs?${params.toString()}`);
  };

  // ----- Logged-out landing page -----
  if (!currentUser) {
    return (
      <div>
        <div className="hero">
          <h1>Find your next opportunity</h1>
          <p>Search thousands of open roles, or post a job in minutes.</p>

          <form className="hero-search" onSubmit={handleHeroSearch}>
            <div className="hero-search-field">
              <Search size={18} className="hero-search-icon" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={heroSearchTerm}
                onChange={(e) => setHeroSearchTerm(e.target.value)}
              />
            </div>
            <div className="hero-search-divider" />
            <div className="hero-search-field">
              <MapPin size={18} className="hero-search-icon" />
              <input
                type="text"
                placeholder="City, or 'remote'"
                value={heroLocation}
                onChange={(e) => setHeroLocation(e.target.value)}
              />
            </div>
            <button type="submit">Find Jobs</button>
          </form>

          <div className="hero-actions">
            <Link to="/register/candidate" className="hero-btn hero-btn-primary">I'm looking for a job</Link>
            <Link to="/register/employer" className="hero-btn hero-btn-secondary">I'm hiring</Link>
          </div>
        </div>

        <div className="section-header">
          <h3>Featured Openings</h3>
          <Link to="/browse-jobs">View all jobs →</Link>
        </div>

        <div className="job-grid">
          {recentJobs.map((job) => (
            <div key={job.id} className="card job-card">
              <div className="job-card-icon">
                <Briefcase size={18} />
              </div>
              <div className="job-card-main">
                <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
                <p className="card-meta">{job.company_name} — {job.location}</p>
              </div>
              <div className="job-card-right">
                <span className="job-type-badge">{job.job_type.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----- Logged-in dashboard -----
  return (
    <div className="home-grid">
      <div>
        <div className="welcome-banner">
          <h2>Good to see you, {currentUser.username}!</h2>
          <p>
            {currentUser.role === 'employer'
              ? "Here's what's happening with your hiring."
              : 'Find the right job and track your applications.'}
          </p>
        </div>

        {stats && currentUser.role === 'employer' && (
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.active_jobs}</span>
              <span className="stat-label">Active Jobs</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.total_jobs}</span>
              <span className="stat-label">Total Jobs Posted</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.total_applications}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.status_breakdown?.shortlisted || 0}</span>
              <span className="stat-label">Shortlisted</span>
            </div>
          </div>
        )}

        {stats && currentUser.role === 'candidate' && (
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.total_applications}</span>
              <span className="stat-label">Applications Sent</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.status_breakdown?.reviewed || 0}</span>
              <span className="stat-label">Reviewed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.status_breakdown?.shortlisted || 0}</span>
              <span className="stat-label">Shortlisted</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.status_breakdown?.rejected || 0}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        )}

        <div className="section-header">
          <h3>{currentUser.role === 'employer' ? 'Your Recent Job Postings' : 'Latest Job Openings'}</h3>
          <Link to="/browse-jobs">View all jobs →</Link>
        </div>

        {recentJobs.map((job) => (
          <div key={job.id} className="card job-card">
            <div className="job-card-icon">
              <Briefcase size={20} />
            </div>
            <div className="job-card-main">
              <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
              <p className="card-meta">
                {currentUser?.role === 'employer' ? job.location : `${job.company_name} — ${job.location}`}
              </p>
            </div>
            <div className="job-card-right">
              <span className="job-type-badge">{job.job_type.replace('_', ' ')}</span>
              {currentUser?.role === 'employer' ? (
                <span className={`status-badge ${job.status === 'open' ? 'status-shortlisted' : 'status-rejected'}`}>
                  {job.status}
                </span>
              ) : (
                (job.salary_min || job.salary_max) && (
                  <span className="card-meta">₹{job.salary_min} - ₹{job.salary_max}</span>
                )
              )}
            </div>
          </div>
        ))}

        <Link to="/browse-jobs" className="view-more-jobs-btn">
          Check out more jobs →
        </Link>
      </div>

      <div className="home-sidebar">
        {stats && (
          <div className="overview-card">
            <h3>Applications Overview</h3>
            {totalForBreakdown === 0 && <p className="card-meta">No applications yet.</p>}
            {Object.entries(stats.status_breakdown || {}).map(([status, count]) => (
              <div key={status} className="overview-row">
                <span className="overview-dot" style={{ backgroundColor: STATUS_COLORS[status] || '#94A3B8' }} />
                <span className="overview-label">{status}</span>
                <span className="overview-count">{count}</span>
              </div>
            ))}
          </div>
        )}

        <div className="overview-card">
          <h3>{currentUser.role === 'employer' ? 'Recent Applicants' : 'Recent Applications'}</h3>
          {recentActivity.length === 0 && <p className="card-meta">Nothing here yet.</p>}
          {recentActivity.map((item) => (
            <div key={item.id} className="activity-row">
              <div className="nav-user-avatar activity-avatar">
                {(item.candidate_username || item.job_title)?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="activity-title">
                  {currentUser.role === 'employer' ? item.candidate_username : item.job_title}
                </p>
                <p className="card-meta">
                  {currentUser.role === 'employer' ? item.job_title : `Status: ${item.status}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="overview-card">
          <h3>Quick Actions</h3>
          {currentUser.role === 'employer' ? (
            <>
              <Link to="/post-job" className="quick-action-link">Post a New Job</Link>
              <Link to="/my-jobs" className="quick-action-link">View My Job Postings</Link>
            </>
          ) : (
            <>
              <Link to="/browse-jobs" className="quick-action-link">Browse Jobs</Link>
              <Link to="/profile" className="quick-action-link">Update Profile</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;