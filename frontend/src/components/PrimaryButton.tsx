import React from 'react';
import styles from './PrimaryButtonStyle.ts';

interface PrimaryButtonProps {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  icon,
  onClick,
  type = 'button',
}) => {
  return (
    <button className={styles.primaryButton} onClick={onClick} type={type}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default PrimaryButton;
