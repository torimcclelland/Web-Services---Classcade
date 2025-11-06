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
              avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500"
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
