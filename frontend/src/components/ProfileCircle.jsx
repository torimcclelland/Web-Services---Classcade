import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getUserIcon } from '../constants/storeItems';

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

  useEffect(() => {
    const updateIcon = () => {
      setIconUrl(getUserSelectedIcon());
    };
    
    updateIcon();
    window.addEventListener('storage', updateIcon);
    window.addEventListener('userUpdated', updateIcon);
    
    return () => {
      window.removeEventListener('storage', updateIcon);
      window.removeEventListener('userUpdated', updateIcon);
    };
  }, []);

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <Circle size={size} onClick={goToProfile}>
      <Avatar src={iconUrl} alt={alt} />
    </Circle>
  );
};

ProfileCircle.propTypes = {
  size: PropTypes.number,
  alt: PropTypes.string,
};

export default ProfileCircle;
