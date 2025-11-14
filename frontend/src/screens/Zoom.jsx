import React from 'react';
import MainLayout from '../components/MainLayout';
import {
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
    <MainLayout>
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
    </MainLayout>
  );
};

export default Zoom;
