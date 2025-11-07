import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavBar';
import ProfileCircle from '../components/ProfileCircle';
import PieChartBox from '../components/PieChartBox';
import BarChartBox from '../components/BarChartBox';
import DashBoardStyle from '../styles/DashboardStyle';

import {
  StatsContainer,
  ContentRow,
  MainContent,
  ChartsWrapper,
  ChartBox,
  SummaryBox,
  SummaryItem,
  PageTitle,
  ProfileRow
} from '../styles/StatsStyle';

const Stats = () => {
  return (
    <StatsContainer>
      <TopNavbar />
      <ContentRow>
        <Sidebar />
        <MainContent>
          <ProfileRow>
            <ProfileCircle
              size={64}
            />
          </ProfileRow>
          <PageTitle>Project Stats</PageTitle>
          <ChartsWrapper>
            <ChartBox>
              <PieChartBox />
            </ChartBox>
            <ChartBox>
              <BarChartBox />
            </ChartBox>
          </ChartsWrapper>
          <SummaryBox>
            <SummaryItem>You have completed <strong>5/20</strong> tasks.</SummaryItem>
            <SummaryItem>Total time spent: <strong>2 hours</strong></SummaryItem>
            <SummaryItem>Your contribution: <strong>25%</strong></SummaryItem>
          </SummaryBox>
        </MainContent>
      </ContentRow>
    </StatsContainer>
  );
};

export default Stats;
