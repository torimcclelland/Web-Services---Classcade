import React from 'react';
import DashboardStyle from '../styles/DashboardStyle';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';

const Dashboard = () => {
  return (
    <div style={dashboardStyles.container}>
      <TopNavBar />

      <div style={dashboardStyles.layout}>
        <Sidebar />

        <main style={dashboardStyles.main}>
          <div style={dashboardStyles.statsPanel}>
            <h2>Dashboard</h2>

            <div style={dashboardStyles.statsGrid}>
              <div style={dashboardStyles.statItem}>
                <label style={dashboardStyles.statLabel}>Overall Progress</label>
                <div style={dashboardStyles.progressBar}>
                  <div style={{ ...dashboardStyles.progressFill, width: '55%' }}></div>
                </div>
                <span>55%</span>
              </div>

              <div style={dashboardStyles.statItem}>
                <label style={dashboardStyles.statLabel}>Streak</label>
                <span>3</span>
              </div>

              <div style={dashboardStyles.statItem}>
                <label style={dashboardStyles.statLabel}>Time Spent</label>
                <span>3 Hours</span>
              </div>

              <div style={dashboardStyles.statItem}>
                <label style={dashboardStyles.statLabel}>Project Due Date</label>
                <span>9 September 2025</span>
              </div>

              <div style={dashboardStyles.statItem}>
                <label style={dashboardStyles.statLabel}>Current Active Task</label>
                <span>Create Prototype</span>
              </div>

              <div style={dashboardStyles.statItem}>
                <label style={dashboardStyles.statLabel}>Task Due Date</label>
                <span>9 September 2025</span>
              </div>
            </div>

            <div style={dashboardStyles.actionButtons}>
              <button style={buttonStyles.primaryButton}>Detailed Stats</button>
              <button style={buttonStyles.primaryButton}>Track Time</button>
              <button style={buttonStyles.primaryButton}>Schedule Meeting</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;