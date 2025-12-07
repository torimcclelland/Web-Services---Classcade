import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ZoomCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React StrictMode or re-renders
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleCallback = async () => {
      const code = searchParams.get('code');
      const userId = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('Authorization failed. Redirecting...');
        setTimeout(() => navigate('/zoom?error=auth_failed'), 2000);
        return;
      }

      if (!code || !userId) {
        setStatus('Invalid callback parameters. Redirecting...');
        setTimeout(() => navigate('/zoom?error=invalid_params'), 2000);
        return;
      }

      try {
        setStatus('Connecting to Zoom...');
        
        const response = await fetch('http://localhost:4000/api/zoom/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, userId })
        });

        const data = await response.json();

        if (response.ok && data.connected) {
          setStatus('Successfully connected! Redirecting...');
          setTimeout(() => navigate('/zoom?connected=true'), 1000);
        } else {
          console.error('Connection failed:', data);
          setStatus(`Connection failed: ${data.error || 'Unknown error'}. Redirecting...`);
          setTimeout(() => navigate('/zoom?error=connection_failed'), 2000);
        }
      } catch (error) {
        console.error('Error processing Zoom callback:', error);
        setStatus('An error occurred. Redirecting...');
        setTimeout(() => navigate('/zoom?error=server_error'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2D8CFF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2 style={{ margin: '0 0 10px', color: '#333' }}>Zoom Integration</h2>
        <p style={{ margin: 0, color: '#666' }}>{status}</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ZoomCallback;
