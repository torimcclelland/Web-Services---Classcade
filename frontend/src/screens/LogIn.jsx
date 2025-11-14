import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../components/TextField";
import PrimaryButton from "../components/PrimaryButton";
import Logo from "../assets/Logo.png";
import api from "../api";

const styles = {
  container: {
    backgroundColor: "#DDF9EA",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    overflowY: "auto",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 34,
    fontWeight: 600,
    marginBottom: 24,
    color: "#0F3E2D",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  buttonGroup: {
    marginTop: 24,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    marginTop: 16,
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: "#2E7D32",
    fontWeight: 500,
    cursor: "pointer",
  },
};

const LogIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) navigate("/home");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/user/login", { username, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      // Parse error message for cleaner display
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle different error formats
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          if (errorData.toLowerCase().includes('user not found') || 
              errorData.toLowerCase().includes('invalid username')) {
            errorMessage = "No account found with this username. Please check your username or sign up.";
          } else if (errorData.toLowerCase().includes('incorrect password') || 
                     errorData.toLowerCase().includes('invalid password')) {
            errorMessage = "Incorrect password. Please try again.";
          } else if (errorData.toLowerCase().includes('invalid credentials')) {
            errorMessage = "Invalid username or password. Please try again.";
          } else {
            errorMessage = errorData;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (err.message === 'Network Error') {
        errorMessage = "Unable to connect to server. Please check your connection.";
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      <img src={Logo} alt="Logo" style={{ width: 150, marginBottom: 20 }} />
      <div style={styles.title}>Welcome Back</div>

      <form style={styles.form} onSubmit={handleLogin}>
        <TextField
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={30}
        />
        
        {/* Password field with eye toggle */}
        <div style={{ position: 'relative' }}>
          <TextField
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={30}
          />
          <button
            type="button"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            onTouchStart={() => setShowPassword(true)}
            onTouchEnd={() => setShowPassword(false)}
            style={{
              position: 'absolute',
              right: '6px',
              top: '55%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              color: '#666',
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye icon (visible)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              // Eye-off icon (hidden)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
        </div>

        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

        <div style={styles.buttonGroup}>
          <PrimaryButton text="Sign In" type="submit" />
        </div>
      </form>

      <div style={styles.footerText}>
        Don't have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/signUp")}>
          Sign up
        </span>
      </div>
    </div>
  );
};

export default LogIn;
