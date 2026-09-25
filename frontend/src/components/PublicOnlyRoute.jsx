import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps pages that should NOT be visible when already logged in
 * (login, register pages). Redirects to home if already authenticated.
 */
function PublicOnlyRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicOnlyRoute;
