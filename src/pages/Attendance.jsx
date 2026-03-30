import { useEffect, useState } from 'react';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import ArrivalHeatmap from '../components/dashboard/ArrivalHeatmap';
import AttendanceTable from '../components/dashboard/AttendanceTable';
import { loadAttendanceRecords, loadRegisteredStudents, getAttendanceStats } from '../utils/attendanceAnalytics';

const SummaryCard = ({ title, value, description, color }) => (
  <div style={{
    padding: '1.25rem',
    borderRadius: '1rem',
    background: 'var(--bg-secondary)',
    border: `1px solid ${color}20`,
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }}>
    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{title}</span>
    <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</span>
    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{description}</span>
  </div>
);

const Attendance = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    lateArrivals: 0,
    blockchainLogs: 0,
    attendanceSubtitle: 'No data available',
    lateSubtitle: 'No late arrivals',
    logsSubtitle: 'No logs available',
  });
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    const allRecords = loadAttendanceRecords();
    const students = loadRegisteredStudents();
    const computed = getAttendanceStats(allRecords, students);
    setStats(computed);
    setAbsentCount(Math.max(0, computed.totalStudents - computed.presentToday));
  }, []);

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Attendance Dashboard</h1>
          <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            Review today’s attendance metrics, trend analysis, and detailed attendance logs in one place.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <SummaryCard
          title="Total Registered"
          value={stats.totalStudents}
          description="Students enrolled for tracking."
          color="#3b82f6"
        />
        <SummaryCard
          title="Present Today"
          value={stats.presentToday}
          description={stats.attendanceSubtitle}
          color="#4ade80"
        />
        <SummaryCard
          title="Late Today"
          value={stats.lateArrivals}
          description={stats.lateSubtitle}
          color="#facc15"
        />
        <SummaryCard
          title="Absent Today"
          value={absentCount}
          description={absentCount > 0 ? 'Students absent today.' : 'No absences recorded.'}
          color="#f87171"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: 'var(--spacing-lg)' }}>
        <AttendanceChart />
        <ArrivalHeatmap />
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Today’s attendance logs</h2>
        <AttendanceTable />
      </div>
    </div>
  );
};

export default Attendance;
