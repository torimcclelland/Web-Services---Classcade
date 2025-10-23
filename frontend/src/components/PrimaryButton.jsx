import React, { useState } from 'react';
import PrimaryButtonStyle from '../styles/PrimaryButtonStyle';

const PrimaryButton = ({ text, icon, onClick, type = 'button' }) => {
  const [isHovered, setHovered] = useState(false);

  const combinedStyle = {
    ...PrimaryButtonStyle.primaryButton,
    ...(isHovered ? PrimaryButtonStyle.primaryButtonHover : {}),
  };

  return (
    <button
      style={combinedStyle}
      onClick={onClick}
      type={type}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => e.target.style.outline = 'none'}
      onBlur={(e) => e.target.style.outline = 'none'}
    >
      {icon && <span style={PrimaryButtonStyle.icon}>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default PrimaryButton;
