import React from 'react';
import { Home, Users, CheckSquare, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = React.useState(null);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Students', path: '/dashboard/students', icon: <Users size={20} /> },
    { name: 'Attendance', path: '/dashboard/attendance', icon: <CheckSquare size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-md)',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
      boxShadow: '10px 0 50px rgba(0,0,0,0.5)'
    }}>
      <div style={{ padding: 'var(--spacing-md) 0', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0 }}>
            Smart<span style={{ color: 'var(--accent-primary)' }}>Class</span>
          </h2>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            CODE TITANS
          </span>
        </div>
        <div style={{ width: '40px', height: '4px', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-round)', marginTop: '4px' }} />
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {navItems.map((item) => {
          const isActive = item.path === '/dashboard'
            ? location.pathname === item.path
            : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          const isHovered = hoveredItem === item.name;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'white' : (isHovered ? 'white' : 'var(--text-secondary)'),
                background: isActive ? 'var(--accent-gradient)' : (isHovered ? 'rgba(255,255,255,0.05)' : 'transparent'),
                textDecoration: 'none',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.95rem',
                transition: 'all var(--transition-normal)',
                transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                boxShadow: isActive ? `0 10px 20px -5px ${isActive ? 'rgba(59, 130, 246, 0.5)' : 'transparent'}` : 'none'
              }}
            >
              <div style={{ 
                color: isActive ? 'white' : (isHovered ? 'var(--accent-primary)' : 'inherit'),
                transition: 'color var(--transition-fast)'
              }}>
                {item.icon}
              </div>
              {item.name}
              {isActive && (
                <div style={{ 
                  marginLeft: 'auto', 
                  width: '6px', 
                  height: '6px', 
                  backgroundColor: 'white', 
                  borderRadius: '50%',
                  boxShadow: '0 0 10px white'
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-color)' }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          color: '#f87171',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'all var(--transition-fast)',
          border: '1px solid transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        >
          <LogOut size={20} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
