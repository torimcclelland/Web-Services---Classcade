import React from 'react';
import TopNavBar from './TopNavBar';
import Sidebar from './Sidebar';
import ProfileCircle from './ProfileCircle';

/**
 * MainLayout - Consistent layout wrapper for all main application pages
 * Provides unified structure with TopNavBar, Sidebar, and ProfileCircle positioning
 */
const MainLayout = ({ children, showSidebar = true }) => {
  const layoutStyle = {
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const contentRowStyle = {
    display: 'flex',
    flex: 1,
    backgroundColor: '#ddf9ea',
  };

  const mainContentStyle = {
    flex: 1,
    padding: '24px',
    paddingTop: '100px', // Increased space for profile icon
    backgroundColor: '#ddf9ea',
    position: 'relative',
  };

  const profileIconStyle = {
    position: 'absolute',
    top: '20px',
    right: '40px',
    zIndex: 10,
  };

  return (
    <div style={layoutStyle}>
      <TopNavBar />
      <div style={contentRowStyle}>
        {showSidebar && <Sidebar />}
        <main style={mainContentStyle}>
          <div style={profileIconStyle}>
            <ProfileCircle size={64} />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
