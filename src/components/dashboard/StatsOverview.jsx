import React from 'react';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { loadAttendanceRecords, loadRegisteredStudents, getAttendanceStats } from '../../utils/attendanceAnalytics';

const StatCard = ({ title, value, subtitle, icon, color }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const isPositive = subtitle.includes('+') || subtitle.includes('%') || subtitle.includes('No');

  return (
    <div 
      className="glass-panel" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        borderLeft: `4px solid ${color}`,
        transition: 'all var(--transition-normal)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 10px 25px -5px ${color}33` : '0 8px 32px rgba(0, 0, 0, 0.2)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '100px',
          height: '100px',
          background: color,
          filter: 'blur(60px)',
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none'
        }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</span>
        <div style={{ 
          color: color,
          backgroundColor: `${color}15`,
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-normal)',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
        }}>
          {icon}
        </div>
      </div>
      
      <div style={{ 
        fontSize: '2.5rem', 
        fontWeight: '800', 
        color: 'var(--text-primary)',
        letterSpacing: '-1px',
        position: 'relative',
        zIndex: 1
      }}>
        {value}
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        fontSize: '0.75rem', 
        color: isPositive ? '#4ade80' : 'var(--text-secondary)',
        fontWeight: '500',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isPositive ? '#4ade80' : 'var(--text-secondary)',
          opacity: 0.6
        }} />
        {subtitle}
      </div>
    </div>
  );
};

const StatsOverview = () => {
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    presentToday: 0,
    lateArrivals: 0,
    blockchainLogs: 0,
    attendanceSubtitle: 'No data available',
    lateSubtitle: 'No late arrivals',
    logsSubtitle: 'No logs available',
  });

  React.useEffect(() => {
    const records = loadAttendanceRecords();
    const students = loadRegisteredStudents();
    setStats(getAttendanceStats(records, students));
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 'var(--spacing-md)',
      marginBottom: 'var(--spacing-lg)'
    }}>
      <StatCard 
        title="Total Students" value={stats.totalStudents} subtitle="Registered for tracking" 
        icon={<Users size={24} />} color="#3b82f6" 
      />
      <StatCard 
        title="Present Today" value={stats.presentToday} subtitle={stats.attendanceSubtitle} 
        icon={<UserCheck size={24} />} color="#4ade80" 
      />
      <StatCard 
        title="Late Arrivals" value={stats.lateArrivals} subtitle={stats.lateSubtitle} 
        icon={<Clock size={24} />} color="#facc15" 
      />
      <StatCard 
        title="Blockchain Logs" value={stats.blockchainLogs} subtitle={stats.logsSubtitle} 
        icon={<TrendingUp size={24} />} color="#8b5cf6" 
      />
    </div>
  );
};

export default StatsOverview;
