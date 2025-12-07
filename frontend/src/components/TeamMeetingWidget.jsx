import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import io from 'socket.io-client';

const TeamMeetingWidget = () => {
  const { selectedProject } = useProject();
  const [teamMeeting, setTeamMeeting] = useState(null);
  const [socket, setSocket] = useState(null);

  const projectId = selectedProject?._id;

  const fetchTeamMeeting = async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`http://localhost:4000/api/zoom/team-meeting/${projectId}`);
      const data = await response.json();
      setTeamMeeting(data.teamMeeting);
    } catch (error) {
      console.error('Error fetching team meeting:', error);
    }
  };

  useEffect(() => {
    fetchTeamMeeting();
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

  // Only show widget if there's an active team meeting
  if (!teamMeeting || !teamMeeting.isActive) {
    return null;
  }

  return (
    <div style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
      <div style={{
      backgroundColor: '#d81d1dff',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
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
      <button
        onClick={() => window.open(teamMeeting.joinUrl, '_blank')}
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
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
        Join Now
      </button>
      </div>
    </div>
    </div>
  );
};

export default TeamMeetingWidget;
