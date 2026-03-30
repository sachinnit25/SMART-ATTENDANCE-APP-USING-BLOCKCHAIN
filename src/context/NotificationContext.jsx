import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, Bell, UserCheck } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, title, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '350px',
        width: '100%'
      }}>
        {notifications.map(n => (
          <div key={n.id} className="glass-panel" style={{
            padding: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            borderLeft: n.type === 'success' ? '4px solid #4ade80' : '4px solid #3b82f6',
            animation: 'slideIn 0.3s ease-out',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
            position: 'relative',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ color: n.type === 'success' ? '#4ade80' : '#3b82f6', marginTop: '2px' }}>
              {n.type === 'success' ? <UserCheck size={20} /> : <Bell size={20} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '2px' }}>{n.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.message}</div>
            </div>
            <button onClick={() => removeNotification(n.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0' }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};
