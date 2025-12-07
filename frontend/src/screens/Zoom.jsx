import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/MainLayout';
import ZoomStyle from '../styles/ZoomStyle';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ZoomLogo from '../assets/ZoomLogo.png';
import { useUser } from '../context/UserContext';

const Zoom = () => {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(() => {
    // Check localStorage for saved connection state
    return localStorage.getItem('zoomConnected') === 'true';
  });
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredMeeting, setHoveredMeeting] = useState(null);

  const userId = user?._id;

  const checkZoomConnection = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:4000/api/zoom/meetings?userId=${userId}`);
      if (response.ok) {
        setIsConnected(true);
        localStorage.setItem('zoomConnected', 'true');
        const data = await response.json();
        setMeetings(data.meetings || []);
      } else if (response.status === 500) {
        const data = await response.json();
        if (data.error?.includes('not connected')) {
          setIsConnected(false);
          localStorage.removeItem('zoomConnected');
        }
      } else if (response.status === 401 || response.status === 403) {
        setIsConnected(false);
        localStorage.removeItem('zoomConnected');
      }
    } catch (error) {
      console.log('Network error checking Zoom connection:', error);
    }
  }, [userId]);

  const fetchMeetings = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:4000/api/zoom/meetings?userId=${userId}`);
      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      setIsConnected(true);
      localStorage.setItem('zoomConnected', 'true');
      window.history.replaceState({}, '', '/zoom');
      setTimeout(() => fetchMeetings(), 500);
    } else if (urlParams.get('error')) {
      setIsConnected(false);
      localStorage.removeItem('zoomConnected');
      alert('Failed to connect Zoom. Please try again.');
      window.history.replaceState({}, '', '/zoom');
    } else {
      checkZoomConnection();
    }
  }, [userId, fetchMeetings, checkZoomConnection]);

  // Show loading or error if user is not available
  if (!user) {
    return (
      <MainLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Please log in to access Zoom integration.</p>
        </div>
      </MainLayout>
    );
  }

  const handleConnectZoom = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/zoom/auth?userId=${userId}`);
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error connecting to Zoom:', error);
      alert('Failed to connect to Zoom. Please try again.');
    }
  };

  const handleCreateMeeting = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/zoom/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, topic: 'Classcade Meeting' })
      });
      
      const data = await response.json();

      if (response.ok && data.meeting?.join_url) {
        window.open(data.meeting.join_url, '_blank');
        setTimeout(() => fetchMeetings(), 1000);
      } else {
        alert(`Failed to create Zoom meeting: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Something went wrong while creating the meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Zoom?')) return;
    
    try {
      await fetch('http://localhost:4000/api/zoom/disconnect', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      setIsConnected(false);
      localStorage.removeItem('zoomConnected');
      setMeetings([]);
      alert('Zoom disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Zoom:', error);
      alert('Failed to disconnect Zoom');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${timeStr}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${timeStr}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  if (isConnected) {
    return (
      <MainLayout>
        <div style={ZoomStyle.container}>
          <div style={ZoomStyle.header}>
            <h1 style={ZoomStyle.title}>Zoom Meetings</h1>
            <div style={ZoomStyle.buttonGroup}>
              <PrimaryButton text="Refresh" onClick={fetchMeetings} />
              <PrimaryButton text="Unlink Account" onClick={handleDisconnect} />
            </div>
          </div>

          <div style={ZoomStyle.statsCard}>
            <div style={ZoomStyle.statItem}>
              <div style={ZoomStyle.statContent}>
                <div style={ZoomStyle.statLabel}>Zoom Status</div>
                <div style={ZoomStyle.statValue}>Connected</div>
              </div>
            </div>
            <div style={ZoomStyle.statItem}>
              <div style={ZoomStyle.statContent}>
                <div style={ZoomStyle.statLabel}>Upcoming Meetings</div>
                <div style={ZoomStyle.statValue}>{meetings.length}</div>
              </div>
            </div>
            <div>
              <PrimaryButton 
                text={loading ? 'Creating...' : 'Create Meeting'} 
                onClick={handleCreateMeeting}
                disabled={loading}
              />
            </div>
          </div>

          {meetings.length > 0 ? (
            <>
              <h2 style={ZoomStyle.sectionTitle}>Upcoming Meetings</h2>
              <div style={ZoomStyle.meetingsGrid}>
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    style={{
                      ...ZoomStyle.meetingCard,
                      ...(hoveredMeeting === meeting.id ? ZoomStyle.meetingCardHover : {}),
                    }}
                    onMouseEnter={() => setHoveredMeeting(meeting.id)}
                    onMouseLeave={() => setHoveredMeeting(null)}
                  >
                    <div style={ZoomStyle.meetingTitle}>{meeting.topic}</div>
                    <div style={ZoomStyle.meetingTime}>
                      🕒 {formatDate(meeting.start_time)}
                    </div>
                    <div style={ZoomStyle.meetingId}>
                      Meeting ID: {meeting.id}
                    </div>
                    <button
                      style={ZoomStyle.joinButton}
                      onClick={() => window.open(meeting.join_url, '_blank')}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#1e40af'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                    >
                      Join Meeting
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={ZoomStyle.emptyMeetings}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <div style={ZoomStyle.emptyMeetingsText}>
                No upcoming meetings scheduled
              </div>
              <PrimaryButton 
                text="Start a Meeting" 
                onClick={handleCreateMeeting}
                disabled={loading}
              />
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={ZoomStyle.container}>
        <div style={ZoomStyle.header}>
          <h1 style={ZoomStyle.title}>Zoom Integration</h1>
        </div>

        <div style={ZoomStyle.emptyState}>
          <img src={ZoomLogo} alt="Zoom Logo" style={ZoomStyle.emptyStateIcon} />
          <h2 style={ZoomStyle.emptyStateTitle}>Connect Your Zoom Account</h2>
          <p style={ZoomStyle.emptyStateText}>
            Integrate Zoom with Classcade to create and manage meetings from right here.
            <br />
            Stay connected with your team and never miss an important meeting!
          </p>
          <PrimaryButton text="Connect to Zoom" onClick={handleConnectZoom} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Zoom;
