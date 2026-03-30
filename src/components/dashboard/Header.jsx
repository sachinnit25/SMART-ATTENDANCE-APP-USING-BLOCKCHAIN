import React, { useEffect, useState } from 'react';
import { Bell, Search } from 'lucide-react';

const PROFESSOR_NAME_KEY = 'overview_professor_name';

const Header = () => {
  const [professorName, setProfessorName] = useState('Prof. Anderson');

  useEffect(() => {
    const savedName = localStorage.getItem(PROFESSOR_NAME_KEY);
    if (savedName) {
      const cleanName = savedName.trim();
      setProfessorName(cleanName ? cleanName : 'Prof. Anderson');
    }
  }, []);

  const displayInitial = professorName.charAt(0).toUpperCase();

  return (
    <header className="glass-panel" style={{
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--spacing-lg)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: '1px solid var(--border-color)',
      borderRadius: 0,
      borderTop: 'none', borderLeft: 'none', borderRight: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '300px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0,0,0,0.2)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-round)',
          border: '1px solid var(--border-color)',
          width: '100%'
        }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search students..." 
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '-2px', right: '-2px',
            width: '8px', height: '8px',
            backgroundColor: '#ef4444',
            borderRadius: '50%'
          }}></span>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{professorName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Computer Science</div>
          </div>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '600', color: '#fff'
          }}>
            {displayInitial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
