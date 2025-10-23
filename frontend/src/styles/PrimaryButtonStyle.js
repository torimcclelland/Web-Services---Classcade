// PrimaryButtonStyle.js

export const PrimaryButtonStyle = {
  primaryButton: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    border: 'none',
    padding: '0.65rem 1.4rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    textDecoration: 'none',
    lineHeight: 1.2,
    width: '180px',
    height: '40px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    outline: 'none',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    backgroundClip: 'padding-box',
  },

  primaryButtonHover: {
    backgroundColor: '#2c4fb2',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
  },

  icon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.2rem',
  },
};

export default PrimaryButtonStyle;

