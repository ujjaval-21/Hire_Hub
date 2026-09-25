import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      await loginUser(username, password);
      navigate('/');
    } catch (error) {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/" className="auth-close-btn" aria-label="Close">
          <X size={18} />
        </Link>
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
        <p className="auth-switch">
          New here? <Link to="/register/candidate">Register as Candidate</Link> or{' '}
          <Link to="/register/employer">Register as Employer</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;