import React from 'react';
import DashboardStyle from '../src/styles/DashboardStyle';
import TopNavBar from '../src/components/TopNavBar';
import SideBar from '../src/components/Sidebar';
import PrimaryButton from '../src/components/PrimaryButton';

const DashboardPage: React.FC = () => {
  return (
    <div className={DashboardStyle.pageWrapper}>
      <SideBar />
      <div className={DashboardStyle.mainContent}>
        <TopNavBar />

        <div className={DashboardStyle.dashboardPanel}>
          <h2 className={DashboardStyle.title}>Dashboard</h2>

          <div className={DashboardStyle.statsGrid}>
            <div className={DashboardStyle.statBox}>
              <label>Overall Progress</label>
              <div className={DashboardStyle.progressBar}>
                <div className={DashboardStyle.progressFill} style={{ width: '55%' }} />
              </div>
              <span className={DashboardStyle.statValue}>55%</span>
            </div>

            <div className={DashboardStyle.statBox}>
              <label>Streak</label>
              <span className={DashboardStyle.statValue}>3</span>
            </div>

            <div className={DashboardStyle.statBox}>
              <label>Time Spent</label>
              <span className={DashboardStyle.statValue}>3 Hours</span>
            </div>

            <div className={DashboardStyle.statBox}>
              <label>Project Due Date</label>
              <span className={DashboardStyle.statValue}>9 September 2025</span>
            </div>

            <div className={DashboardStyle.statBox}>
              <label>Current Active Task</label>
              <span className={DashboardStyle.statValue}>Create Prototype</span>
            </div>

            <div className={DashboardStyle.statBox}>
              <label>Task Due Date</label>
              <span className={DashboardStyle.statValue}>9 September 2025</span>
            </div>
          </div>

          <div className={DashboardStyle.buttonRow}>
            <PrimaryButton text="Detailed Stats" />
            <PrimaryButton text="Track Time" />
            <PrimaryButton text="Schedule Meeting" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


