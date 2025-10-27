import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import TopNavBar from '../components/TopNavBar';
import ProfileCircle from '../components/ProfileCircle';
import Logo from '../assets/Logo.png';

const storeStyles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#DDF9EA',
    boxSizing: 'border-box',
    padding: 24,
    paddingTop: 50,
  },
  fixedTop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  profileFixed: {
    position: 'fixed',
    top: 80,
    right: 40,
    zIndex: 9998,
  },
  content: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 145
  },
  left: {
    flex: '1 1 500px',
    minWidth: '300px',
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    padding: '0px 16px',
    color: '#fff',
    minHeight: '400px',
  },
  rightColumn: {
    flex: '1 1 500px', // grow/shrink with 500px min, wraps on small screens
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  rightBox: {
    flex: 1,
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    padding: '0px 16px',
    color: '#fff',
    minHeight: '192px',
  }
};

const Store = () => {
  return (
    <div style={storeStyles.page}>
      <div style={storeStyles.fixedTop}>
        <TopNavBar />
      </div>
      <div style={storeStyles.profileFixed}>
        <ProfileCircle avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" size={64} />
      </div>

      <div style={storeStyles.content}>
        <div style={storeStyles.left}>
          <h1>Icons</h1>
        </div>
        <div style={storeStyles.rightColumn}>
            <div style={storeStyles.rightBox}>
            <h1>Banners</h1>
          </div>
          <div style={storeStyles.rightBox}>
            <h1>Backdrops</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;