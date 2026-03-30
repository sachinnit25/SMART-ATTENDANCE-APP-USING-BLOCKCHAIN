import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { loadAttendanceRecords, aggregateWeeklyAttendance } from '../../utils/attendanceAnalytics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)'
      }}>
        <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '0.875rem' }}>
          <span style={{ fontWeight: '600' }}>Attendance:</span> {payload[0].value} students
        </p>
      </div>
    );
  }
  return null;
};

const AttendanceChart = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const records = loadAttendanceRecords();
    setData(aggregateWeeklyAttendance(records));
  }, []);

  return (
    <div className="glass-panel" style={{ 
      padding: 'var(--spacing-lg)', 
      height: '400px', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Weekly Attendance Trend</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Based on stored attendance records</p>
        </div>
        <div style={{ 
          padding: '0.5rem 1rem', 
          borderRadius: 'var(--radius-round)', 
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: 'var(--accent-primary)',
          fontSize: '0.75rem',
          fontWeight: '600',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          Last 7 Days
        </div>
      </div>
      
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={15}
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent-primary)', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="var(--accent-primary)" 
              strokeWidth={4}
              dot={{ fill: 'var(--accent-primary)', r: 4, strokeWidth: 2, stroke: 'var(--bg-secondary)' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
