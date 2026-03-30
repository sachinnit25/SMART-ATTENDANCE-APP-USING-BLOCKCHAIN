import React from 'react';
import { ExternalLink, CheckCircle2, Clock } from 'lucide-react';

const AttendanceTable = () => {
  const [hoveredRow, setHoveredRow] = React.useState(null);
  const [records, setRecords] = React.useState([]);

  // Load real data from storage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('attendance_records');
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse attendance records", err);
      }
    }
  }, []);

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all attendance logs? This will not affect the blockchain.")) {
      localStorage.removeItem('attendance_records');
      setRecords([]);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'Present') {
      return {
        background: 'rgba(74, 222, 128, 0.1)',
        color: '#4ade80',
        border: '1px solid rgba(74, 222, 128, 0.2)'
      };
    }
    return {
      background: 'rgba(250, 204, 21, 0.1)',
      color: '#facc15',
      border: '1px solid rgba(250, 204, 21, 0.2)'
    };
  };

  const getStatusIcon = (status) => {
    if (status === 'Present') return <CheckCircle2 size={14} strokeWidth={3} />;
    return <Clock size={14} strokeWidth={3} />;
  };

  const exportToCSV = () => {
    const headers = ['Student Name', 'Time', 'Status', 'Blockchain Hash'];
    const rows = records.map(record => [record.student, record.time, record.status, record.fullHash]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toLocaleDateString().replace(/\//g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_records_${timestamp}.csv`);
    link.click();
  };

  return (
    <div className="glass-panel" style={{ border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Student Attendance Log</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Real-time immutable verification</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {records.length > 0 && (
            <button 
              onClick={handleClearLogs}
              style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                color: '#f87171',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              Clear Logs
            </button>
          )}
          <button 
            onClick={exportToCSV}
            className="btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            disabled={records.length === 0}
          >
            Export Dataset
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem var(--spacing-lg)', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student Details</th>
              <th style={{ padding: '1rem var(--spacing-lg)', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
              <th style={{ padding: '1rem var(--spacing-lg)', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Status</th>
              <th style={{ padding: '1rem var(--spacing-lg)', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blockchain Proof</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                  <p>No attendance records found yet.</p>
                  <p style={{ fontSize: '0.75rem' }}>Recognize faces on the Home page to see them here.</p>
                </td>
              </tr>
            ) : (
              records.map((record, idx) => (
              <tr 
                key={record.id} 
                onMouseEnter={() => setHoveredRow(record.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ 
                  backgroundColor: hoveredRow === record.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <td style={{ padding: '1.25rem var(--spacing-lg)', borderTop: idx !== 0 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '40px', height: '40px', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--accent-gradient)',
                      padding: '2px'
                    }}>
                      <div style={{
                        width: '100%', height: '100%',
                        borderRadius: 'calc(var(--radius-md) - 2px)',
                        background: 'var(--bg-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)'
                      }}>
                        {record.student.charAt(0)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{record.student}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{record.status || 'Attendance record'}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem var(--spacing-lg)', borderTop: idx !== 0 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {record.timestamp ? new Date(record.timestamp).toLocaleTimeString() : record.time}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {record.timestamp ? new Date(record.timestamp).toLocaleDateString() : record.date || 'Unknown date'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem var(--spacing-lg)', borderTop: idx !== 0 ? '1px solid var(--border-color)' : 'none' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-round)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: hoveredRow === record.id ? `0 0 15px currentColor` : 'none',
                    transition: 'all 0.3s ease',
                    ...getStatusStyle(record.status)
                  }}>
                    {getStatusIcon(record.status)}
                    {record.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1.25rem var(--spacing-lg)', borderTop: idx !== 0 ? '1px solid var(--border-color)' : 'none' }}>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${record.fullHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: hoveredRow === record.id ? 'var(--text-primary)' : 'var(--accent-primary)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      transition: 'all 0.2s ease',
                      backgroundColor: hoveredRow === record.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    <span>{record.txHash}</span>
                    <ExternalLink size={14} />
                  </a>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{ padding: '1.25rem var(--spacing-lg)', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600' }}>
          Showing {records.length} record{records.length === 1 ? '' : 's'}
        </span>
        {records.length === 0 && (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>No attendance data available yet.</span>
        )}
      </div>
    </div>
  );
};

export default AttendanceTable;
