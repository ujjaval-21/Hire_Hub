import { Bookmark } from 'lucide-react';

function SaveJobButton({ jobId, savedJobIds, toggleSave, isCandidate }) {
  if (!isCandidate) return null;

  const isSaved = savedJobIds.has(jobId);

  return (
    <button
      className={`save-job-btn ${isSaved ? 'save-job-btn-active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(jobId);
      }}
      aria-label={isSaved ? 'Unsave job' : 'Save job'}
    >
      <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
    </button>
  );
}

export default SaveJobButton;