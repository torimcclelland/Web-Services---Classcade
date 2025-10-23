import React from 'react';
import styles from '../styles/PrimaryButtonStyle';

const PrimaryButton = ({ text, icon, onClick, type = 'button' }) => {
  return (
    <button className={styles.primaryButton} onClick={onClick} type={type}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default PrimaryButton;

