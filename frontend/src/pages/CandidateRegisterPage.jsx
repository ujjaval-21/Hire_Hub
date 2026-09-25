import { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';

function CandidateRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
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
      await apiClient.post('/users/register/candidate/', formData);
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
        <h2>Register as Candidate</h2>
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
            <label>Full Name</label>
            <input name="full_name" value={formData.full_name} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default CandidateRegisterPage;