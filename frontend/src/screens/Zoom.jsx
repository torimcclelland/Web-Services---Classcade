import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import ProfileCircle from '../components/ProfileCircle';
import {
  ZoomContainer,
  ContentRow,
  MainContent,
  ProfileRow,   // make sure this matches StatsStyle spacing
  ZoomHeader,
  ZoomMessage,
  ButtonRow,
  ZoomButton,
  PageTitle
} from '../styles/ZoomStyle';

const Zoom = () => {
  return (
    <ZoomContainer>
      <TopNavBar />
      <ContentRow>
        <Sidebar />
        <MainContent>
          {/* Match Stats layout */}
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
              Browse our downloadable background library!
            </ZoomMessage>
            <ButtonRow>
              <ZoomButton color="blue">Shop</ZoomButton>
              <ZoomButton color="green">Launch Zoom</ZoomButton>
            </ButtonRow>
          </ZoomHeader>
        </MainContent>
      </ContentRow>
    </ZoomContainer>
  );
};

export default Zoom;

