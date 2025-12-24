// src/app/(main)/analytics/loading.tsx
export default function Loading() {
  return (
    <div style={{
      height: '80vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }}>
      <div style={{
        border: '4px solid rgba(255, 255, 255, 0.1)',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>
        Calculating Analytics...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}