import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { X } from 'lucide-react';


function EmployerRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    company_name: '',
    company_website: '',
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
      await apiClient.post('/users/register/employer/', formData);
      navigate('/login');
    } catch (error) {
      setErrorMessage('Registration failed. Please check your details.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/" className="auth-close-btn" aria-label="Close">
          <X size={18} />
        </Link>
        <h2>Register as Employer</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label>Company Name</label>
            <input name="company_name" value={formData.company_name} onChange={handleChange} required />
          </div>
          <div>
            <label>Company Website</label>
            <input name="company_website" value={formData.company_website} onChange={handleChange} />
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default EmployerRegisterPage;