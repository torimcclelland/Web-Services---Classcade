import React from 'react';

const styles = {
  wrapper: {
    marginBottom: '16px',
    width: '100%',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#2E7D32',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    color: '#666',
  },
  input: {
    width: '100%',
    padding: '12px',
    paddingLeft: '12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
};

const TextField = ({
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = 'text',
  name,
  maxLength,
}) => {
  return (
    <div style={styles.wrapper}>
      {label && <label style={styles.label}>{label}</label>}
      <div style={styles.inputContainer}>
        {icon && <span style={styles.icon}>{icon}</span>}
        <input
          type={type}
          name={name}
          style={{ ...styles.input, paddingLeft: icon ? '40px' : '12px' }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

export default TextField;
