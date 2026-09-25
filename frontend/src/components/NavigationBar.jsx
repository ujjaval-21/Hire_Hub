import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import { Briefcase, Search, ChevronDown, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function NavigationBar() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Reset dropdown state whenever the logged-in user changes
  // (covers logout -> login again, so the menu doesn't stay open)
  useEffect(() => {
    setShowMenu(false);
    setShowLogoutModal(false);
  }, [currentUser]);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/browse-jobs?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="top-navbar">
      <Link to="/" className="brand">
        <Briefcase size={22} /> HireHub
      </Link>

      {currentUser && (
        <form className="nav-search" onSubmit={handleSearch}>
          <Search size={16} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}

      <div className="nav-spacer" />
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {currentUser && (
        <>
          <NotificationBell />
          <div className="nav-user-menu" onClick={() => setShowMenu((s) => !s)}>
            <div className="nav-user-avatar">{currentUser.username[0].toUpperCase()}</div>
            <span>{currentUser.username} <span className="nav-user-role">({currentUser.role})</span></span>
            <ChevronDown size={16} />
            {showMenu && (
              <div className="nav-user-dropdown">
                <Link to="/profile" onClick={() => setShowMenu(false)}>Profile</Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    setShowLogoutModal(true);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {!currentUser && (
        <>
          <Link to="/login" className="nav-plain-link">Login</Link>
          <Link to="/register/candidate" className="nav-plain-link">Register as Candidate</Link>
          <Link to="/register/employer" className="nav-plain-link">Register as Employer</Link>
        </>
      )}

      {showLogoutModal && (
        <ConfirmLogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </nav>
  );
}

export default NavigationBar;