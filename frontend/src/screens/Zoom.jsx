import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavBar';
import ProfileCircle from '../components/ProfileCircle';
import {
  ZoomContainer,
  MainContent,
  ProfileRow,
  ZoomHeader,
  ZoomMessage,
  ButtonRow,
  ZoomButton,
  PageTitle
} from '../styles/ZoomStyle';

const Zoom = () => {
  return (
    <ZoomContainer>
      <Sidebar />
      <MainContent>
        <TopNavbar />
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
            Browse our downloadable background library!
          </ZoomMessage>
          <ButtonRow>
            <ZoomButton color="blue">Shop</ZoomButton>
            <ZoomButton color="green">Launch Zoom</ZoomButton>
          </ButtonRow>
        </ZoomHeader>
      </MainContent>
    </ZoomContainer>
  );
};

export default Zoom;
