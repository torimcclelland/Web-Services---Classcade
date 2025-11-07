import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Circle = styled.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Name = styled.span`
  margin-left: 10px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

const ProfileCircle = ({ avatarUrl, name, size = 48, alt = 'User avatar' }) => {
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <Wrapper onClick={goToProfile}>
      <Circle size={size}>
        <Avatar src={avatarUrl} alt={alt} />
      </Circle>
      {name && <Name>{name}</Name>}
    </Wrapper>
  );
};

ProfileCircle.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  name: PropTypes.string,
  size: PropTypes.number,
  alt: PropTypes.string,
};

export default ProfileCircle;

