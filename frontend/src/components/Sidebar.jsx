import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import {
  LayoutDashboard, Search, Briefcase, FileText, User, Bell,
  Settings, HelpCircle, LogOut, PlusCircle, Bookmark
} from 'lucide-react';


function Sidebar() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-section">
          <NavLink to="/" end className="sidebar-link">
            <LayoutDashboard size={18} /> Home
          </NavLink>
          <NavLink to="/browse-jobs" className="sidebar-link">
            <Search size={18} /> Browse Jobs
          </NavLink>

          {currentUser?.role === 'candidate' && (
            <>
              <NavLink to="/my-applications" className="sidebar-link">
                <FileText size={18} /> My Applications
              </NavLink>
              <NavLink to="/saved-jobs" className="sidebar-link">
                <Bookmark size={18} /> Saved Jobs
              </NavLink>
            </>
          )}
  
          {currentUser?.role === 'employer' && (
            <>
              <NavLink to="/post-job" className="sidebar-link">
                <PlusCircle size={18} /> Post a Job
              </NavLink>
              <NavLink to="/my-jobs" className="sidebar-link">
                <Briefcase size={18} /> My Job Postings
              </NavLink>
            </>
          )}
  
          <NavLink to="/notifications" className="sidebar-link">
            <Bell size={18} /> Notifications
          </NavLink>
        </div>
        
        <div className="sidebar-spacer" />
        
        <div className="sidebar-section sidebar-account-section">
          <NavLink to="/profile" className="sidebar-link">
            <User size={18} /> Profile
          </NavLink>
          <NavLink to="/settings" className="sidebar-link">
            <Settings size={18} /> Settings
          </NavLink>
          <NavLink to="/help" className="sidebar-link">
            <HelpCircle size={18} /> Help & Support
          </NavLink>
          <button className="sidebar-link sidebar-logout" onClick={() => setShowLogoutModal(true)}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
        
      {showLogoutModal && (
        <ConfirmLogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}

export default Sidebar;