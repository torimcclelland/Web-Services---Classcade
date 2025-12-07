import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import {
  ZoomHeader,
  ZoomMessage,
  ButtonRow,
  ZoomButton,
  PageTitle
} from '../styles/ZoomStyle';

const Zoom = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = '69038607d8d8d5f275a6f3ca';

  useEffect(() => {
    checkZoomConnection();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      setIsConnected(true);
      fetchMeetings();
      window.history.replaceState({}, '', '/zoom');
    }
  }, []);

  const checkZoomConnection = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/zoom/meetings?userId=${userId}`);
      if (response.ok) {
        setIsConnected(true);
        const data = await response.json();
        setMeetings(data.meetings || []);
      }
    } catch (error) {
      console.log('Zoom not connected yet');
      setIsConnected(false);
    }
  };

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

  const fetchMeetings = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/zoom/meetings?userId=${userId}`);
      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
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

      if (data.meeting?.join_url) {
        window.open(data.meeting.join_url, '_blank');
        fetchMeetings(); // Refresh meetings list
      } else {
        alert('Failed to create Zoom meeting.');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Something went wrong while creating the meeting.');
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
      setMeetings([]);
      alert('Zoom disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Zoom:', error);
      alert('Failed to disconnect Zoom');
    }
  };

  return (
    <MainLayout>
      <PageTitle>Zoom Portal</PageTitle>

      <ZoomHeader>
        {!isConnected ? (
          <>
            <ZoomMessage>
              Connect your Zoom account to create and manage meetings directly from Classcade.
            </ZoomMessage>
            <ButtonRow>
              <ZoomButton color="blue" onClick={handleConnectZoom}>
                Connect Zoom
              </ZoomButton>
            </ButtonRow>
          </>
        ) : (
          <>
            <ZoomMessage>
              You have <strong>{meetings.length} upcoming Zoom meeting(s)</strong>.
            </ZoomMessage>
            <ButtonRow>
              <ZoomButton color="green" onClick={handleCreateMeeting} disabled={loading}>
                {loading ? 'Creating...' : 'Create Instant Meeting'}
              </ZoomButton>
              <ZoomButton color="gray" onClick={fetchMeetings}>
                Refresh Meetings
              </ZoomButton>
              <ZoomButton color="red" onClick={handleDisconnect}>
                Disconnect Zoom
              </ZoomButton>
            </ButtonRow>

            {/* Display meetings list */}
            {meetings.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3>Upcoming Meetings:</h3>
                {meetings.map((meeting) => (
                  <div key={meeting.id} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
                    <strong>{meeting.topic}</strong>
                    <br />
                    Start: {new Date(meeting.start_time).toLocaleString()}
                    <br />
                    <a href={meeting.join_url} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </ZoomHeader>
    </MainLayout>
  );
};

export default Zoom;
