import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { Pencil, Upload, FileText } from 'lucide-react';

function EditProfilePage() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [resumes, setResumes] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    apiClient.get('/users/me/profile/').then((res) => {
      setProfile(res.data);
      setFormData(res.data);
    });
    if (currentUser?.role === 'candidate') {
      apiClient.get('/applications/resumes/').then((res) => setResumes(res.data));
    }
  }, [currentUser]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    try {
      const response = await apiClient.patch('/users/me/profile/', formData);
      setProfile(response.data);
      setFormData(response.data);
      setIsEditing(false);
      setStatusMessage('Profile updated successfully!');
    } catch (error) {
      setStatusMessage('Failed to update profile.');
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleResumeUpload = async (event) => {
    event.preventDefault();
    if (!resumeFile) return;
    const uploadData = new FormData();
    uploadData.append('file', resumeFile);
    try {
      const response = await apiClient.post('/applications/resumes/', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumes([response.data, ...resumes]);
      setUploadMessage('Resume uploaded!');
      setResumeFile(null);
    } catch (error) {
      setUploadMessage('Upload failed.');
    }
  };

  if (!profile || !formData) return <p>Loading...</p>;

  const isCandidate = currentUser.role === 'candidate';

  return (
    <div>
      <div className="section-header">
        <h2 className="page-title" style={{ marginBottom: 0 }}>Edit Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-secondary">
            <Pencil size={15} /> Edit Profile
          </button>
        )}
      </div>

      <div className="card form-card-wide">
        <div className="form-row">
          <p className="profile-static-field">
            <span className="profile-field-label">Username</span>
            <span>{currentUser.username}</span>
          </p>
          <p className="profile-static-field">
            <span className="profile-field-label">Email</span>
            <span>{currentUser.email}</span>
          </p>
        </div>

        <form onSubmit={handleSave}>
          {isCandidate ? (
            <>
              <div className="form-row">
                <div>
                  <label>Full Name</label>
                  <input name="full_name" value={formData.full_name || ''} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div>
                  <label>Phone</label>
                  <input name="phone" value={formData.phone || ''} onChange={handleChange} disabled={!isEditing} />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Gender</label>
                  <select name="gender" value={formData.gender || ''} onChange={handleChange} disabled={!isEditing}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label>Date of Birth</label>
                  <input type="date" name="date_of_birth" value={formData.date_of_birth || ''} onChange={handleChange} disabled={!isEditing} />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Location</label>
                  <input name="location" value={formData.location || ''} onChange={handleChange} disabled={!isEditing} placeholder="City, Country" />
                </div>
                <div>
                  <label>Headline</label>
                  <input name="headline" value={formData.headline || ''} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Backend Developer" />
                </div>
              </div>

              <div className="form-full">
                <label>Skills</label>
                <input name="skills" value={formData.skills || ''} onChange={handleChange} disabled={!isEditing} placeholder="Python, Django, React (comma-separated)" />
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div>
                  <label>Company Name</label>
                  <input name="company_name" value={formData.company_name || ''} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div>
                  <label>Company Website</label>
                  <input name="company_website" value={formData.company_website || ''} onChange={handleChange} disabled={!isEditing} />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Industry</label>
                  <input name="industry" value={formData.industry || ''} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Fintech, Retail" />
                </div>
                <div>
                  <label>Company Size</label>
                  <select name="company_size" value={formData.company_size || ''} onChange={handleChange} disabled={!isEditing}>
                    <option value="">Select</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>
              </div>

              <div className="form-full">
                <label>Location</label>
                <input name="location" value={formData.location || ''} onChange={handleChange} disabled={!isEditing} placeholder="City, Country" />
              </div>

              <div className="form-full">
                <label>Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} disabled={!isEditing} />
              </div>
            </>
          )}

          {isEditing && (
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
              <button type="submit">Save Changes</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          )}
          {statusMessage && <p className="success-text" style={{ marginTop: '0.6rem' }}>{statusMessage}</p>}
        </form>
      </div>

      {isCandidate && (
        <div className="card form-card-wide" style={{ marginTop: '1.2rem' }}>
          <h3 style={{ marginTop: 0 }}>Resumes</h3>

          {resumes.length === 0 && <p className="card-meta">No resumes uploaded yet.</p>}
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-row">
              <FileText size={16} />
              <a href={resume.file} target="_blank" rel="noreferrer">{resume.original_filename}</a>
            </div>
          ))}

          <form onSubmit={handleResumeUpload} className="resume-upload-form">
            <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} />
            <button type="submit"><Upload size={15} /> Upload Resume</button>
          </form>
          {uploadMessage && <p className="success-text">{uploadMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default EditProfilePage;