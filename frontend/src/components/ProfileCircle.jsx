import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getUserIcon, getUserBackdrop } from '../constants/storeItems';
import star from '../assets/star.png';
import flame from '../assets/fire.png';

const Circle = styled.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  overflow: visible; /* allow large icons to extend */
  display: inline-block;
  background-color: transparent; /* remove white circle */
  cursor: pointer;
  position: relative;
  z-index: 100;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 101;
  background-color: transparent;
  display: block;
`;

const ProfileCircle = ({ size = 48, alt = 'User avatar' }) => {
  const navigate = useNavigate();
  const [iconUrl, setIconUrl] = useState(getUserIcon(null));
  const [backdrop, setBackdrop] = useState(null);
  
  const getUserSelectedIcon = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return getUserIcon(user.selectedIcon);
      }
    } catch (error) {
      console.error('Error getting user icon:', error);
    }
    return getUserIcon(null);
  };

  const getUserSelectedBackdrop = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return getUserBackdrop(user.selectedBackdrop);
      }
    } catch (error) {
      console.error('Error getting user backdrop:', error);
    }
    return null;
  };

  useEffect(() => {
    const updateIconAndBackdrop = () => {
      setIconUrl(getUserSelectedIcon());
      setBackdrop(getUserSelectedBackdrop());
    };
    
    updateIconAndBackdrop();
    window.addEventListener('storage', updateIconAndBackdrop);
    window.addEventListener('userUpdated', updateIconAndBackdrop);
    
    return () => {
      window.removeEventListener('storage', updateIconAndBackdrop);
      window.removeEventListener('userUpdated', updateIconAndBackdrop);
    };
  }, []);

  const goToProfile = () => {
    navigate("/profile");
  };

  // Render backdrop based on type and size
  const renderBackdrop = (type, color, size) => {
    const scale = size / 48; // scale backdrops relative to default 48px size
    const backdropStyle = {
      position: 'absolute',
      zIndex: 1,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    switch(type) {
      case 'circle':
        return <div style={{
          ...backdropStyle,
          width: 55 * scale,
          height: 55 * scale,
          borderRadius: '50%',
          border: `${3.0 * scale}px solid ${color}`,
        }} />;
      
      case 'star':
        return (
          <img
            src={star}
            alt="star backdrop"
            style={{
              ...backdropStyle,
              width: 75 * scale,
              height: 75 * scale,
              transform: `translate(-50%, calc(-50% + ${3 * scale}px))`,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        );
      
      case 'hexagon':
        return <div style={{
          ...backdropStyle,
          width: 65 * scale,
          height: 55 * scale,
          backgroundColor: color,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          opacity: 0.8,
        }} />;
      
      case 'doublering':
        return <>
          <div style={{
            ...backdropStyle,
            width: 65 * scale,
            height: 65 * scale,
            borderRadius: '50%',
            border: `${3 * scale}px solid ${color}`,
          }} />
          <div style={{
            ...backdropStyle,
            width: 54 * scale,
            height: 54 * scale,
            borderRadius: '50%',
            border: `${2 * scale}px solid ${color}`,
          }} />
        </>;
      
      case 'diamond':
        return <div style={{
          ...backdropStyle,
          width: 50 * scale,
          height: 50 * scale,
          backgroundColor: color,
          transform: 'translate(-50%, -50%) rotate(45deg)',
          opacity: 0.7,
        }} />;
      
      case 'flame':
        return (
          <img
            src={flame}
            alt="fire backdrop"
            style={{
              ...backdropStyle,
              width: 60 * scale,
              height: 60 * scale,
              transform: `translate(calc(-50% - ${1 * scale}px), calc(-50% - ${12 * scale}px))`,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Circle size={size} onClick={goToProfile}>
      {backdrop && renderBackdrop(backdrop.type, backdrop.color, size)}
      <Avatar src={iconUrl} alt={alt} />
    </Circle>
  );
};

ProfileCircle.propTypes = {
  size: PropTypes.number,
  alt: PropTypes.string,
};

export default ProfileCircle;
