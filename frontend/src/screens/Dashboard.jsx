import React from 'react';
import DashboardStyle from '../styles/DashboardStyle';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';

function DashboardPage() {
  return (
    <div style={DashboardStyle.pageWrapper}>
      <SideBar />
      <TopNavBar />

      <div style={DashboardStyle.dashboardPanel}>
        <h2 style={DashboardStyle.title}>Dashboard</h2>

        <div style={DashboardStyle.statsGrid}>
          <div style={DashboardStyle.statBox}>
            <label>Overall Progress</label>
            <div style={DashboardStyle.progressBar}>
              <div style={DashboardStyle.progressFill} />
            </div>
            <span style={DashboardStyle.statValue}>55%</span>
          </div>

          <div style={DashboardStyle.statBox}>
            <label>Streak</label>
            <span style={DashboardStyle.statValue}>3</span>
          </div>

          <div style={DashboardStyle.statBox}>
            <label>Time Spent</label>
            <span style={DashboardStyle.statValue}>3 Hours</span>
          </div>

          <div style={DashboardStyle.statBox}>
            <label>Project Due Date</label>
            <span style={DashboardStyle.statValue}>9 September 2025</span>
          </div>

          <div style={DashboardStyle.statBox}>
            <label>Current Active Task</label>
            <span style={DashboardStyle.statValue}>Create Prototype</span>
          </div>

          <div style={DashboardStyle.statBox}>
            <label>Task Due Date</label>
            <span style={DashboardStyle.statValue}>9 September 2025</span>
          </div>
        </div>

        <div style={DashboardStyle.buttonRow}>
          <PrimaryButton text="Detailed Stats" />
          <PrimaryButton text="Track Time" />
          <PrimaryButton text="Schedule Meeting" />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;