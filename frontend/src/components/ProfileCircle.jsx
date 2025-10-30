import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Circle = styled.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  background-color: #f0f0f0;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileCircle = ({ avatarUrl, size = 48, alt = 'User avatar' }) => {
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate("/profile");
  }
  return (
    <Circle size={size} onClick={goToProfile}>
      <Avatar src={avatarUrl} alt={alt} />
    </Circle>
  );
};

ProfileCircle.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  size: PropTypes.number,
  alt: PropTypes.string,
};

export default ProfileCircle;
