import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'full_time',
    salary_min: '',
    salary_max: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      const response = await apiClient.post('/jobs/', formData);
      navigate(`/jobs/${response.data.id}`);
    } catch (error) {
      setErrorMessage('Failed to post job. Make sure you are logged in as an employer.');
    }
  };

  return (
    <div>
      <h2 className="page-title">Post a Job</h2>
      <div className="card form-card-wide">
        <form onSubmit={handleSubmit}>
          <div className="form-full">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-full">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div>
              <label>Location</label>
              <input name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div>
              <label>Job Type</label>
              <select name="job_type" value={formData.job_type} onChange={handleChange}>
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
              <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} />
            </div>
            <div>
              <label>Salary Max</label>
              <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} />
            </div>
          </div>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <button type="submit">Post Job</button>
        </form>
      </div>
    </div>
  );
}

export default PostJobPage;