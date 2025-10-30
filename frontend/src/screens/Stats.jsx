import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavBar';
import ProfileCircle from '../components/ProfileCircle';
import PieChartBox from '../components/PieChartBox';
import BarChartBox from '../components/BarChartBox';
import DashBoardStyle from '../styles/DashboardStyle';

import {
  StatsContainer,
  ChartsWrapper,
  ChartBox,
  SummaryBox,
  SummaryItem,
  PageTitle
} from '../styles/StatsStyle';

const Stats = () => {
  return (
    <StatsContainer>
      <Sidebar />
      <div className="main-content">
        <TopNavbar />
        <div style={DashBoardStyle.profileHeader}>
          <ProfileCircle
            avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500"
            size={64}
          />
        </div>
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
      </div>
    </StatsContainer>
  );
};

export default Stats;
