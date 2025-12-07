import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/MainLayout';
import ZoomStyle from '../styles/ZoomStyle';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ZoomLogo from '../assets/ZoomLogo.png';
import { useUser } from '../context/UserContext';
import { useProject } from '../context/ProjectContext';
import io from 'socket.io-client';

const Zoom = () => {
  const { user } = useUser();
  const { selectedProject } = useProject();
  const [isConnected, setIsConnected] = useState(() => {
    // Check localStorage for saved connection state
    return localStorage.getItem('zoomConnected') === 'true';
  });
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredMeeting, setHoveredMeeting] = useState(null);
  const [teamMeeting, setTeamMeeting] = useState(null);
  const [socket, setSocket] = useState(null);

  const userId = user?._id;
  const projectId = selectedProject?._id;

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

  const fetchTeamMeeting = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`http://localhost:4000/api/zoom/team-meeting/${projectId}`);
      const data = await response.json();
      setTeamMeeting(data.teamMeeting);
    } catch (error) {
      console.error('Error fetching team meeting:', error);
    }
  }, [projectId]);

  // Socket.IO setup for real-time team meeting updates
  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    if (projectId) {
      newSocket.emit('joinRoom', `project_${projectId}`);
      
      newSocket.on('teamMeetingUpdate', ({ teamMeeting: updatedTeamMeeting }) => {
        setTeamMeeting(updatedTeamMeeting);
      });
    }

    return () => {
      if (projectId) {
        newSocket.emit('leaveRoom', `project_${projectId}`);
      }
      newSocket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    if (!userId) return;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      setIsConnected(true);
      localStorage.setItem('zoomConnected', 'true');
      window.history.replaceState({}, '', '/zoom');
      setTimeout(() => {
        fetchMeetings();
        fetchTeamMeeting();
      }, 500);
    } else if (urlParams.get('error')) {
      setIsConnected(false);
      localStorage.removeItem('zoomConnected');
      alert('Failed to connect Zoom. Please try again.');
      window.history.replaceState({}, '', '/zoom');
    } else {
      checkZoomConnection();
      fetchTeamMeeting();
    }
  }, [userId, fetchMeetings, checkZoomConnection, fetchTeamMeeting]);

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

  const handleStartTeamMeeting = async () => {
    if (!projectId) {
      alert('Please select a project first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/zoom/team-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, projectId })
      });
      
      const data = await response.json();

      if (response.ok && data.teamMeeting) {
        setTeamMeeting(data.teamMeeting);
        socket?.emit('teamMeetingCreated', { projectId, teamMeeting: data.teamMeeting });
        // Automatically open the meeting for the creator
        window.open(data.teamMeeting.startUrl, '_blank');
      } else {
        alert(`Failed to start team meeting: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error starting team meeting:', error);
      alert('Something went wrong while starting the team meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndTeamMeeting = async () => {
    if (!projectId) return;
    if (!window.confirm('Are you sure you want to end the team meeting for everyone?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/zoom/team-meeting/${projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setTeamMeeting(null);
        socket?.emit('teamMeetingEnded', { projectId });
        alert('Team meeting ended');
      }
    } catch (error) {
      console.error('Error ending team meeting:', error);
      alert('Failed to end team meeting');
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
              <SecondaryButton text="Unlink Account" onClick={handleDisconnect} />
            </div>
          </div>

          {/* Team Meeting Banner */}
          {teamMeeting && teamMeeting.isActive ? (
            <div style={{
              background:'#d81d1dff',
              color:'white',
              padding: '12px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 600, lineHeight: '1' }}>
                      Active Meeting
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 400, opacity: 0.95, lineHeight: '1' }}>
                      Started by {teamMeeting.createdBy?.firstName || 'Unknown'} {teamMeeting.createdBy?.lastName || ''}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => window.open(teamMeeting.joinUrl, '_blank')}
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1.5px solid white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    Join Meeting
                  </button>
                  <button
                    onClick={handleEndTeamMeeting}
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1.5px solid white',
                      padding: '7px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    End Meeting
                  </button>
                </div>
              </div>
            </div>
          ) : null}

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
                text={loading ? 'Starting...' : '+ Project Meeting'} 
                onClick={handleStartTeamMeeting}
                disabled={loading || !projectId}
              />
            </div>
          </div>

          {meetings.length > 0 ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <h2 style={{ ...ZoomStyle.sectionTitle, margin: 0 }}>Upcoming Meetings</h2>
                <button
                  onClick={fetchMeetings}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000ff',
                    transition: 'color 0.2s, transform 0.2s',
                    borderRadius: '4px',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#2563EB';
                    e.currentTarget.style.transform = 'rotate(180deg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#6B7280';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.color = '#2563EB';
                    e.currentTarget.style.transform = 'rotate(180deg)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.color = '#6B7280';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fetchMeetings();
                    }
                  }}
                  title="Refresh meetings"
                  aria-label="Refresh meetings"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                </button>
              </div>
              <div style={ZoomStyle.meetingsGrid}>
                {meetings.map((meeting) => {
                  const titleId = `meeting-title-${meeting.id}`;
                  return (
                    <article
                      key={meeting.id}
                      aria-labelledby={titleId}
                      style={{
                        ...ZoomStyle.meetingCard,
                        ...(hoveredMeeting === meeting.id ? ZoomStyle.meetingCardHover : {}),
                      }}
                      onMouseEnter={() => setHoveredMeeting(meeting.id)}
                      onMouseLeave={() => setHoveredMeeting(null)}
                      onFocus={() => setHoveredMeeting(meeting.id)}
                      onBlur={() => setHoveredMeeting(null)}
                    >
                      <div id={titleId} style={ZoomStyle.meetingTitle}>{meeting.topic}</div>
                      <div style={ZoomStyle.meetingTime}>
                        🕒 {formatDate(meeting.start_time)}
                      </div>
                      <div style={ZoomStyle.meetingId}>
                        Meeting ID: {meeting.id}
                      </div>
                      <button
                        style={ZoomStyle.joinButton}
                        onClick={() => window.open(meeting.join_url, '_blank')}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                        onFocus={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                        onBlur={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.open(meeting.join_url, '_blank');
                          }
                        }}
                        aria-label={`Join meeting ${meeting.topic}`}
                      >
                        Join Meeting
                      </button>
                    </article>
                  );
                })}
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
                onClick={handleStartTeamMeeting}
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
