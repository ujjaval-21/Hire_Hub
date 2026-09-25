import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useSavedJobs } from '../hooks/useSavedJobs';
import SaveJobButton from '../components/SaveJobButton';
import { Briefcase } from 'lucide-react';

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { savedJobIds, toggleSave, isCandidate } = useSavedJobs();

  useEffect(() => {
    apiClient.get('/jobs/saved/').then((res) => {
      setSavedJobs(res.data);
      setIsLoading(false);
    });
  }, [savedJobIds.size]);

  return (
    <div>
      <h2 className="page-title">Saved Jobs</h2>

      {isLoading && <p>Loading...</p>}

      {!isLoading && savedJobs.length === 0 && (
        <div className="empty-state">
          <p>You haven't saved any jobs yet.</p>
          <Link to="/browse-jobs">Browse open jobs →</Link>
        </div>
      )}

      {savedJobs.map((saved) => (
        <div key={saved.id} className="card job-card">
          <div className="job-card-icon">
            <Briefcase size={20} />
          </div>
          <div className="job-card-main">
            <h3><Link to={`/jobs/${saved.job_detail.id}`}>{saved.job_detail.title}</Link></h3>
            <p className="card-meta">{saved.job_detail.company_name} — {saved.job_detail.location}</p>
          </div>
          <div className="job-card-right">
            <SaveJobButton jobId={saved.job_detail.id} savedJobIds={savedJobIds} toggleSave={toggleSave} isCandidate={isCandidate} />
            <span className="job-type-badge">{saved.job_detail.job_type.replace('_', ' ')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SavedJobsPage;