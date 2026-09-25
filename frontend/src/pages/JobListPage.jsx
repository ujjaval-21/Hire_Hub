import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useSavedJobs } from '../hooks/useSavedJobs';
import SaveJobButton from '../components/SaveJobButton';

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

const SORT_OPTIONS = [
  { value: '-posted_at', label: 'Newest First' },
  { value: 'posted_at', label: 'Oldest First' },
  { value: '-salary_max', label: 'Salary: High to Low' },
  { value: 'salary_min', label: 'Salary: Low to High' },
];

function JobListPage() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState('');
  const [sortBy, setSortBy] = useState('-posted_at');
  const { savedJobIds, toggleSave, isCandidate } = useSavedJobs();

  const fetchJobs = async (params) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/jobs/', { params });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildParams = (search, location, type, ordering) => {
    const params = { ordering };
    if (search) params.search = search;
    if (location) params.location = location;
    if (type) params.job_type = type;
    return params;
  };

  useEffect(() => {
    const initialSearch = searchParams.get('search') || '';
    const initialLocation = searchParams.get('location') || '';
    setSearchTerm(initialSearch);
    setLocationTerm(initialLocation);
    fetchJobs(buildParams(initialSearch, initialLocation, jobType, sortBy));
  }, [searchParams]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchJobs(buildParams(searchTerm, locationTerm, jobType, sortBy));
  };

  const handleJobTypeChange = (value) => {
    setJobType(value);
    fetchJobs(buildParams(searchTerm, locationTerm, value, sortBy));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    fetchJobs(buildParams(searchTerm, locationTerm, jobType, value));
  };

  return (
    <div>
      <h2 className="page-title">Browse Jobs</h2>

      <form onSubmit={handleSearchSubmit} className="job-search-bar">
        <div className="job-search-field">
          <Search size={16} className="job-search-icon" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="job-search-field">
          <MapPin size={16} className="job-search-icon" />
          <input
            type="text"
            placeholder="Location"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
      </form>

      <div className="job-filter-bar">
        <div className="job-type-pills">
          {JOB_TYPES.map((type) => (
            <button
              type="button"
              key={type.value}
              className={`filter-tab ${jobType === type.value ? 'filter-tab-active' : ''}`}
              onClick={() => handleJobTypeChange(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="sort-select">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {!isLoading && (
        <p className="results-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
      )}

      {isLoading && <p>Loading jobs...</p>}

      {!isLoading && jobs.length === 0 && (
        <div className="empty-state">
          <p>No jobs match your search.</p>
        </div>
      )}

      {jobs.map((job) => (
        <div key={job.id} className="card job-card">
          <div className="job-card-icon">
            <Briefcase size={20} />
          </div>
          <div className="job-card-main">
            <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
            <p className="card-meta">{job.company_name} — {job.location}</p>
          </div>
          <div className="job-card-right">
            <SaveJobButton jobId={job.id} savedJobIds={savedJobIds} toggleSave={toggleSave} isCandidate={isCandidate} />
            <span className="job-type-badge">{job.job_type.replace('_', ' ')}</span>
            {(job.salary_min || job.salary_max) && (
              <span className="card-meta">₹{job.salary_min} - ₹{job.salary_max}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobListPage;