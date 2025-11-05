import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import PrimaryButton from '../components/PrimaryButton';
import ProfileStyle from '../styles/ProfileStyle';
import ProfileCircle from '../components/ProfileCircle';
import SideBar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleButtonClick = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 1200);
  };

  const handleStoreClick = () => {
    navigate('/store');
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <div style={ProfileStyle.container}>
      <TopNavBar />
      <div style={ProfileStyle.layout}>
        <SideBar />
        <main style={ProfileStyle.main}>
          <div style={ProfileStyle.profilePanel}>
            {/* Profile Header with Circle */}
            <div style={ProfileStyle.profileHeader}>
              <ProfileCircle 
                avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500" 
                size={120} 
                alt="John Smith"
              />
              <div style={ProfileStyle.profileHeaderText}>
                <h1 style={ProfileStyle.profileName}>John Smith</h1>
                <p style={ProfileStyle.profileEmail}>jsmith@gmail.com</p>
              </div>
            </div>

            {/* Divider */}
            <div style={ProfileStyle.divider} />

            {/* Profile Info Section */}
            <div style={ProfileStyle.infoSection}>
              <h2 style={ProfileStyle.sectionTitle}>Account Information</h2>
              <div style={ProfileStyle.infoGrid}>
                <div style={ProfileStyle.infoCard}>
                  <span style={ProfileStyle.infoLabel}>Member Since</span>
                  <span style={ProfileStyle.infoValue}>October 2022</span>
                </div>
                <div style={ProfileStyle.infoCard}>
                  <span style={ProfileStyle.infoLabel}>Total Projects</span>
                  <span style={ProfileStyle.infoValue}>12</span>
                </div>
                <div style={ProfileStyle.infoCard}>
                  <span style={ProfileStyle.infoLabel}>Tasks Completed</span>
                  <span style={ProfileStyle.infoValue}>87</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={ProfileStyle.actionButtons}>
              <PrimaryButton
                text="Edit Info"
                onClick={() => handleButtonClick('Editing Info')}
              />
              <PrimaryButton
                text="Store"
                onClick={() => handleStoreClick()}
              />
              <PrimaryButton
                text="Logout"
                onClick={() => handleLogout()}
              />
            </div>
          </div>
        </main>
      </div>

      {popupMessage && (
        <div style={ProfileStyle.overlay}>
          <div style={ProfileStyle.popup}>
            <p style={ProfileStyle.popupText}>{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
