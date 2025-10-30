import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavBar';
import Profile from '../components/ProfileCircle';
import PieChartBox from '../components/PieChartBox';
import BarChartBox from '../components/BarChartBox';

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
        <Profile />
        <PageTitle>Project Stats</PageTitle>
        <ChartsWrapper>
          <ChartBox>
            <PieChartBox/>
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
