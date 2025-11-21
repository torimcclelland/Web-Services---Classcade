import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../components/TextField";
import PrimaryButton from "../components/PrimaryButton";
import api from "../api";
import Logo from "../assets/Logo.png";

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
    boxSizing: "border-box",
    overflowY: "auto",
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

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
  }, []);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      await api.post("/api/user/createuser", {
        firstName,
        lastName,
        email,
        username,
        password,
      });

      // Auto-login after successful signup
      try {
        const loginRes = await api.post("/api/user/login", { username, password });
        const userData = loginRes.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Fetch and cache user projects on signup (will be empty initially)
        try {
          const projectsRes = await api.get(`/api/project/user/${userData._id}`);
          localStorage.setItem('userProjects', JSON.stringify(projectsRes.data));
          localStorage.setItem('userProjectsTimestamp', Date.now().toString());
        } catch (projErr) {
          console.error("Error caching projects on signup:", projErr);
        }
        
        navigate("/home");
      } catch (loginErr) {
        // If auto-login fails, still show success and redirect to login
        alert("Account created successfully! Please log in.");
        navigate("/");
      }
    } catch (err) {
      let errorMessage = "Error creating account.";
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        if (typeof errorData === 'string') {
          if (errorData.toLowerCase().includes('email') && errorData.toLowerCase().includes('dup')) {
            errorMessage = "This email is already registered. Please use a different email or log in if this is your account.";
          } else if (errorData.toLowerCase().includes('username') && errorData.toLowerCase().includes('dup')) {
            errorMessage = "This username is already taken. Please choose a different username.";
          } else {
            errorMessage = errorData;
          }
        }
        // Handle object errors (like mongoose validation errors)
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      <img src={Logo} alt="Logo" style={{ width: 150, marginBottom: 20 }} />
      <div style={styles.title}>Create Your Account</div>

      <form style={styles.form} onSubmit={handleSignUp}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={45}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          maxLength={45}
        />
        <TextField
          label="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={45}
        />
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={45}
        />
        
        {/* Password field with eye toggle */}
        <div style={{ position: 'relative' }}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={45}
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
        
        <div style={{ fontSize: 12, color: "#666", marginTop: -8 }}>
          Password must be at least 6 characters with 1 uppercase letter and 1 special character
        </div>

        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

        <div style={styles.buttonGroup}>
          <PrimaryButton text="Sign Up" type="submit" />
        </div>
      </form>

      <div style={styles.footerText}>
        Already have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/")}>
          Log in
        </span>
      </div>
    </div>
  );
};

export default SignUp;
