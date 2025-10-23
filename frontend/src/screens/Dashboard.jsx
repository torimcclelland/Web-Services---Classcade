import React from 'react';
import DashboardStyle from '../styles/DashboardStyle';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';

const Dashboard = () => {
  return (
    <div style={DashboardStyle.container}>
      <TopNavBar />

      <div style={DashboardStyle.layout}>
        <SideBar />

        <main style={DashboardStyle.main}>
          <div style={DashboardStyle.statsPanel}>
            <h2>Dashboard</h2>

            <div style={DashboardStyle.statsGrid}>
              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Overall Progress</label>
                <div style={DashboardStyle.progressBar}>
                  <div style={{ ...DashboardStyle.progressFill, width: '55%' }}></div>
                </div>
                <span>55%</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Streak</label>
                <span>3</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Time Spent</label>
                <span>3 Hours</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Project Due Date</label>
                <span>9 September 2025</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Current Active Task</label>
                <span>Create Prototype</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Task Due Date</label>
                <span>9 September 2025</span>
              </div>
            </div>

            <div style={DashboardStyle.actionButtons}>
              <PrimaryButton text="Detailed Stats" />
              <PrimaryButton text="Track Time" />
              <PrimaryButton text="Schedule Meeting" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;