import React, { useState, useEffect} from 'react';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import Logo from '../assets/Logo.png';

const styles = {
  container: {
    padding: 24,
    backgroundColor: '#E6F4EA',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    inset: 0,
    padding: 24,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 34,
    fontWeight: 600,
    marginBottom: 24,
    color: '#2E7D32',
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: 24,
    display: 'flex',
    gap: 12,
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    marginTop: 16,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  link: {
    color: '#2E7D32',
    fontWeight: 500,
    cursor: 'pointer',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }
};

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignUp = () => {
    console.log('User clicked Sign up');
    // TODO: Navigate to dashboard
  };

  useEffect(() => {
    const prevBodyMargin = document.body.style.margin;
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.margin = prevBodyMargin;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Student login:', { email, password });
    // TODO: Navigate to dashboard
  };

  return (
    <div style={styles.container}>
      <img
        src={Logo}
        alt="Logo"
        style={{ width: 150, height: 'auto', marginBottom: 20 }}
      />
      <div style={styles.title}>Welcome Back</div>
      <form style={styles.form}>
        <TextField
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div style={styles.buttonGroup}>
          <PrimaryButton text="Sign In" onClick={handleLogin} />
        </div>
      </form>
      <div style={styles.footerText}>
        Don't have an account?{' '}
        <span
          style={styles.link}
          role="button"
          tabIndex={0}
          onClick={handleSignUp}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleSignUp();
          }}
        >
          Sign up
        </span>
      </div>
    </div>
  );
};

export default LogIn;