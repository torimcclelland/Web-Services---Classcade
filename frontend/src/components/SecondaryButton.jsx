import React, { useState } from 'react';
import SecondaryButtonStyle from '../styles/SecondaryButtonStyle';

const SecondaryButton = ({ text, icon, onClick, type = 'button' }) => {
  const [isHovered, setHovered] = useState(false);

  const combinedStyle = {
    ...SecondaryButtonStyle.secondaryButton,
    ...(isHovered ? SecondaryButtonStyle.secondaryButtonHover : {}),
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
      {icon && <span style={SecondaryButtonStyle.icon}>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default SecondaryButton;
