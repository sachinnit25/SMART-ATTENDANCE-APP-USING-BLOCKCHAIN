import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import CameraAccess from '../components/CameraAccess';

function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  return (
    <div className="app-container" style={{ padding: 'var(--spacing-lg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '-10%', left: '-10%',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(10, 11, 16, 0) 70%)',
        zIndex: 0, pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-10%', right: '-10%',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(10, 11, 16, 0) 70%)',
        zIndex: 0, pointerEvents: 'none'
      }}></div>
      
      <div className="glass-panel" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '800px',
        width: '100%',
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)'
      }}>
        
        {!showCamera && (
          <div className="animate-float" style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>
            ✨
          </div>
        )}

        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)', lineHeight: '1.2' }}>
          Smart <span className="text-gradient">Attendance</span>
        </h1>
        
        {!showCamera && (
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)', 
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            A premium, face-recognition powered attendance management system built for the modern era.
          </p>
        )}

        {!showCamera ? (
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginTop: 'var(--spacing-md)' }}>
            <button 
              className="btn-primary"
              onClick={() => setShowCamera(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                padding: '1rem 2rem',
                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 15px 30px -15px var(--accent-primary)' : 'none',
              }}
            >
              Start Face Recognition
            </button>
            
            <Link to="/dashboard" style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '1rem 2rem',
              borderRadius: 'var(--radius-round)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all var(--transition-normal)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
            >
              Teacher Dashboard
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', width: '100%' }}>
            <CameraAccess />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-lg)' }}>
              <button 
                onClick={() => setShowCamera(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  textDecoration: 'underline'
                }}
              >
                Go Back
              </button>
              <Link to="/dashboard" style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                padding: '0.5rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                textDecoration: 'underline'
              }}>
                Dashboard View
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
