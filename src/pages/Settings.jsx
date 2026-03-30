import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'app_settings';

const defaultSettings = {
  classStartTime: '08:00',
  attendanceThreshold: 0.55,
  gracePeriodMinutes: 10,
  notificationsEnabled: true,
  blockchainNetwork: 'Testnet',
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(stored) }));
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>Application Settings</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            Configure required defaults for attendance logging, face recognition, notifications, and blockchain behavior.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Save Settings
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Class Start Time</label>
          <input
            type="time"
            value={settings.classStartTime}
            onChange={(e) => updateSetting('classStartTime', e.target.value)}
            style={{ width: '180px', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          />
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            This time is used to determine late arrivals and attendance cutoffs.
          </p>
        </section>

        <section style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Face Recognition Threshold</label>
          <input
            type="number"
            min="0.4"
            max="0.75"
            step="0.01"
            value={settings.attendanceThreshold}
            onChange={(e) => updateSetting('attendanceThreshold', parseFloat(e.target.value) || 0)}
            style={{ width: '180px', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          />
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Lower values make recognition stricter; higher values allow more leniency.
          </p>
        </section>

        <section style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Late Grace Period (minutes)</label>
          <input
            type="number"
            min="0"
            max="60"
            step="1"
            value={settings.gracePeriodMinutes}
            onChange={(e) => updateSetting('gracePeriodMinutes', parseInt(e.target.value, 10) || 0)}
            style={{ width: '180px', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          />
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Students arriving after the class start time plus this grace period are marked as late.
          </p>
        </section>

        <section style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Notifications</label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            Enable live attendance notifications
          </label>
        </section>

        <section style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Blockchain Network</label>
          <select
            value={settings.blockchainNetwork}
            onChange={(e) => updateSetting('blockchainNetwork', e.target.value)}
            style={{ width: '220px', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          >
            <option value="Testnet">Stellar Testnet</option>
            <option value="Public">Stellar Public</option>
          </select>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Choose the network used for attendance transaction logging.
          </p>
        </section>
      </div>

      {saved && (
        <div style={{ marginTop: '1.5rem', color: '#4ade80', fontWeight: '700' }}>
          Settings saved successfully.
        </div>
      )}
    </div>
  );
};

export default Settings;
