import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const StudentDetail = () => {
  const { studentName } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('registeredStudents');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const decodedName = decodeURIComponent(studentName || '');
        const found = Array.isArray(parsed)
          ? parsed.find((item) => item.name === decodedName)
          : null;
        setStudent(found);
      } catch {
        setStudent(null);
      }
    }
  }, [studentName]);

  if (!student) {
    return (
      <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Student not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          We could not load the student profile. Please return to the student list and select a registered student.
        </p>
        <Link to="/dashboard/students" className="btn-secondary" style={{ padding: '0.85rem 1.25rem' }}>
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>{student.name}</h2>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
            This is the student details view for attendance tracking.
          </p>
        </div>
        <Link to="/dashboard/students" className="btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
          Back to Students
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
          <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-secondary)' }}>Student Name</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.05rem' }}>{student.name}</p>
        </div>
        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
          <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-secondary)' }}>Attendance Status</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.05rem' }}>Registered for face recognition attendance</p>
        </div>
        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
          <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-secondary)' }}>Descriptor Data</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.05rem' }}>{student.descriptor ? student.descriptor.length : 'Unavailable'} face descriptor values</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
