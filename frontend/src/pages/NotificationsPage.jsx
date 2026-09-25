import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/notifications/').then((res) => {
      setNotifications(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read/`, { is_read: true });
      setNotifications((current) => current.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return (
    <div>
      <h2 className="page-title">Notifications</h2>
      {isLoading && <p>Loading...</p>}
      {!isLoading && notifications.length === 0 && <p>No notifications yet.</p>}
      {notifications.map((n) => (
        <div key={n.id} className="card" style={{ opacity: n.is_read ? 0.6 : 1 }}>
          <p style={{ margin: 0 }}>{n.message}</p>
          <p className="card-meta" style={{ margin: '0.3rem 0' }}>
            {new Date(n.created_at).toLocaleString()}
          </p>
          {!n.is_read && <button onClick={() => handleMarkAsRead(n.id)}>Mark as read</button>}
        </div>
      ))}
    </div>
  );
}

export default NotificationsPage;