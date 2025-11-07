import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import ProfileCircle from '../components/ProfileCircle';
import {
  ZoomContainer,
  ContentRow,
  MainContent,
  ProfileRow,
  ZoomHeader,
  ZoomMessage,
  ButtonRow,
  ZoomButton,
  PageTitle
} from '../styles/ZoomStyle';

const Zoom = () => {
  const handleLaunchZoom = async () => {
    try {
      const response = await fetch('/api/zoom/create'); // Adjust path if needed
      const data = await response.json();

      if (data.join_url) {
        window.open(data.join_url, '_blank'); // Open Zoom meeting in new tab
      } else {
        alert('Failed to launch Zoom meeting.');
      }
    } catch (error) {
      console.error('Error launching Zoom:', error);
      alert('Something went wrong while launching Zoom.');
    }
  };

  return (
    <ZoomContainer>
      <TopNavBar />
      <ContentRow>
        <Sidebar />
        <MainContent>
          <ProfileRow>
            <ProfileCircle
              size={64}
            />
          </ProfileRow>

          <PageTitle>Zoom Portal</PageTitle>

          <ZoomHeader>
            <ZoomMessage>
              FirstName LastName,<br />
              you have <strong>3 upcoming Zoom meeting(s)</strong>.<br />
            </ZoomMessage>
            <ButtonRow>
              <ZoomButton color="green" onClick={handleLaunchZoom}>
                Launch Zoom
              </ZoomButton>
            </ButtonRow>
          </ZoomHeader>
        </MainContent>
      </ContentRow>
    </ZoomContainer>
  );
};

export default Zoom;
