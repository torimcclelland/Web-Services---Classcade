import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import api from '../api';
import Logo from '../assets/Logo.png';

const styles = {
  container: {
    backgroundColor: '#DDF9EA',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    inset: 0,
    padding: 24,
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  title: {
    fontSize: 34,
    fontWeight: 600,
    marginBottom: 24,
    color: '#0F3E2D',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  buttonGroup: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    marginTop: 16,
    fontSize: 14,
    color: '#555',
  },
  link: {
    color: '#2E7D32',
    fontWeight: 500,
    cursor: 'pointer',
  }
};

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/api/user/createuser', {
        firstName,
        lastName,
        email,
        username,
        password
      });

      alert('Account created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data || "Error creating account.");
    }
  };

  return (
    <div style={styles.container}>
      <img src={Logo} alt="Logo" style={{ width: 150, marginBottom: 20 }} />

      <div style={styles.title}>Create Your Account</div>

      <form style={styles.form} onSubmit={handleSignUp}>
        <TextField label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <TextField label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}

        <div style={styles.buttonGroup}>
          <PrimaryButton text="Sign Up" type="submit" />
        </div>
      </form>

      <div style={styles.footerText}>
        Already have an account?{' '}
        <span style={styles.link} onClick={() => navigate('/')}>Log in</span>
      </div>
    </div>
  );
};

export default SignUp;