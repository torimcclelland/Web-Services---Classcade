import React from 'react';
import styles from './DashboardStyle.ts';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/SideBar';
import PrimaryButton from '../components/PrimaryButton';

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <SideBar />
      <div className={styles.mainContent}>
        <TopNavBar />

        <div className={styles.dashboardPanel}>
          <h2 className={styles.title}>Dashboard</h2>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <label>Overall Progress</label>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '55%' }} />
              </div>
              <span className={styles.statValue}>55%</span>
            </div>

            <div className={styles.statBox}>
              <label>Streak</label>
              <span className={styles.statValue}>3</span>
            </div>

            <div className={styles.statBox}>
              <label>Time Spent</label>
              <span className={styles.statValue}>3 Hours</span>
            </div>

            <div className={styles.statBox}>
              <label>Project Due Date</label>
              <span className={styles.statValue}>9 September 2025</span>
            </div>

            <div className={styles.statBox}>
              <label>Current Active Task</label>
              <span className={styles.statValue}>Create Prototype</span>
            </div>

            <div className={styles.statBox}>
              <label>Task Due Date</label>
              <span className={styles.statValue}>9 September 2025</span>
            </div>
          </div>

          <div className={styles.buttonRow}>
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


