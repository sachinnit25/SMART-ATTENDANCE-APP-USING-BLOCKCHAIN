import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { loadAttendanceRecords, aggregateArrivalHours } from '../../utils/attendanceAnalytics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)'
      }}>
        <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: payload[0].payload.count > 30 ? '#ef4444' : 'var(--accent-primary)' }} />
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {payload[0].value} students arrived
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ArrivalHeatmap = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const records = loadAttendanceRecords();
    setData(aggregateArrivalHours(records));
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
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)' }}>Peak Arrival Hours</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tracked from actual attendance events</p>
      </div>
      
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
            <XAxis 
              dataKey="hour" 
              stroke="var(--text-secondary)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={15}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={24}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.count > 30 ? 'var(--accent-secondary)' : 'var(--accent-primary)'}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ 
        marginTop: 'var(--spacing-md)', 
        display: 'flex', 
        gap: '1rem', 
        fontSize: '0.75rem', 
        color: 'var(--text-secondary)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
          <span>Normal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)' }} />
          <span>Peak Traffic</span>
        </div>
      </div>
    </div>
  );
};

export default ArrivalHeatmap;
