import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Bell } from 'lucide-react';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/notifications/').then((res) => setNotifications(res.data));
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div
      className="notification-bell"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <button className="bell-button" onClick={() => navigate('/notifications')} aria-label="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="bell-dropdown">
          {recentNotifications.length === 0 && (
            <p className="card-meta" style={{ padding: '0.75rem' }}>No notifications yet.</p>
          )}
          {recentNotifications.map((n) => (
            <div key={n.id} className="bell-dropdown-item" style={{ opacity: n.is_read ? 0.6 : 1 }}>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>{n.message}</p>
            </div>
          ))}
          <div className="bell-dropdown-footer" onClick={() => navigate('/notifications')}>
            View all notifications
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;