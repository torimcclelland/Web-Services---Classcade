import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import PrimaryButton from '../components/PrimaryButton';
import ProfileStyle from '../styles/ProfileStyle';

const Profile = () => {
  const [popupMessage, setPopupMessage] = useState('');

  const handleButtonClick = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 1200);
  };

  return (
    <div style={ProfileStyle.container}>
      <TopNavBar />

      <main style={ProfileStyle.main}>
        <div style={ProfileStyle.profilePanel}>
          <h2 style={ProfileStyle.title}>Your Profile</h2>

          <div style={ProfileStyle.infoRow}>
            <strong>Name:</strong> John Smith
          </div>
          <div style={ProfileStyle.infoRow}>
            <strong>Email:</strong> jsmith@gmail.com
          </div>
          <div style={ProfileStyle.infoRow}>
            <strong>Member since:</strong> October 2022
          </div>

          <div style={ProfileStyle.actionButtons}>
            <PrimaryButton
              text="Edit Info"
              onClick={() => handleButtonClick('Editing Info')}
            />
            <PrimaryButton
              text="Store"
              onClick={() => handleButtonClick('Accessing Store')}
            />
          </div>
        </div>
      </main>

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
