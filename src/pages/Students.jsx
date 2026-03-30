import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('registeredStudents');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStudents(Array.isArray(parsed) ? parsed : []);
      } catch {
        setStudents([]);
      }
    }
  }, []);

  const deleteStudent = (name) => {
    if (!window.confirm(`Delete ${name} from registered students? This cannot be undone.`)) {
      return;
    }

    const updated = students.filter((student) => student.name !== name);
    setStudents(updated);
    localStorage.setItem('registeredStudents', JSON.stringify(updated));
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>Student Directory</h2>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
            View registered students, open their profiles, or remove them from tracking.
          </p>
        </div>
      </div>

      {students.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {students.map((student) => (
            <div
              key={student.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
              }}
            >
              <Link
                to={encodeURIComponent(student.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  flex: 1
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>{student.name}</p>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {student.name} is registered for attendance tracking.
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => deleteStudent(student.name)}
                style={{
                  marginLeft: '1rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#ef4444',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          No students are registered yet. Register students from the camera access page to populate this dashboard.
        </div>
      )}
    </div>
  );
};

export default Students;
