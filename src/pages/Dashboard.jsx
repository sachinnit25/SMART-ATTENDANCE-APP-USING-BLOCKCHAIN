import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Overview from './Overview';
import Students from './Students';
import StudentDetail from './StudentDetail';
import Attendance from './Attendance';
import Settings from './Settings';

const PlaceholderPage = ({ title, description }) => (
  <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)' }}>
    <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>{title}</h2>
    <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', maxWidth: '700px' }}>{description}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-primary)', 
      display: 'flex',
      backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.05), transparent 50%), radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.03), transparent 40%)'
    }}>
      <Sidebar />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        marginLeft: '260px',
        position: 'relative' 
      }}>
        <Header />
        
        <main style={{ 
          padding: 'var(--spacing-lg)', 
          flex: 1, 
          maxWidth: '1600px', 
          margin: '0 auto', 
          width: '100%' 
        }}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:studentName" element={<StudentDetail />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
