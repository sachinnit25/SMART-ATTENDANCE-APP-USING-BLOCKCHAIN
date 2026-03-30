import React from 'react';

const AttendanceLogger = ({ transactions, walletAddress, isWalletReady }) => {
  return (
    <div className="glass-panel" style={{
      padding: 'var(--spacing-md)',
      width: '100%',
      maxWidth: '640px',
      margin: 'var(--spacing-md) auto 0 auto',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Blockchain Ledger</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            backgroundColor: isWalletReady ? '#4ade80' : '#facc15',
            boxShadow: `0 0 10px ${isWalletReady ? '#4ade80' : '#facc15'}`
          }}></div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {isWalletReady ? 'Connected to Stellar Testnet' : 'Funding Wallet...'}
          </span>
        </div>
      </div>

      {walletAddress && (
        <div style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column' }}>
          System App Wallet: <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{walletAddress}</span>
        </div>
      )}

      <div style={{
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-sm)',
        minHeight: '100px',
        maxHeight: '200px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem', fontStyle: 'italic' }}>
            Awaiting cryptographic signatures...
          </div>
        ) : (
          transactions.map((tx, idx) => {
            const displayTime = tx.time || (tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : 'Unknown time');
            const transactionHash = tx.fullHash || tx.txHash || '';

            return (
              <div key={idx} style={{ 
                display: 'flex', justifyContent: 'space-between', 
                padding: '0.5rem', 
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ color: '#4ade80', fontWeight: '600', marginRight: '0.5rem' }}>✓</span>
                  <strong>{tx.student}</strong> <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem', fontSize: '0.75rem' }}>logged at {displayTime}</span>
                </div>
                <div>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${transactionHash}`}
                    target="_blank" rel="noreferrer"
                    style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontFamily: 'monospace', fontWeight: '600' }}
                  >
                    Verify Hash
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AttendanceLogger;
