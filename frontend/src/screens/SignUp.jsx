import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../components/TextField";
import PrimaryButton from "../components/PrimaryButton";
import api from "../api";
import Logo from "../assets/Logo.png";

const styles = {
  container: {
    backgroundColor: "#DDF9EA",
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 12,
    paddingTop: 20,
    boxSizing: "border-box",
    overflow: "hidden",
  },
  title: {
    fontSize: 30,
    fontWeight: 600,
    marginBottom: 12,
    color: "#0F3E2D",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  buttonGroup: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    marginTop: 12,
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("at least one uppercase letter");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("at least one special character");
    }
    
    if (errors.length > 0) {
      return "Password must contain " + errors.join(", ");
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
    
    // Reset errors
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    };

    // Validate all fields
    let hasErrors = false;
    
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      hasErrors = true;
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      hasErrors = true;
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else {
      const emailError = validateEmail(email);
      if (emailError) {
        newErrors.email = emailError;
        hasErrors = true;
      }
    }
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
      hasErrors = true;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        newErrors.password = passwordError;
        hasErrors = true;
      }
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasErrors = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
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
        const loginRes = await api.post("/api/user/login", {
          username,
          password,
        });
        const userData = loginRes.data.user;
        localStorage.setItem("user", JSON.stringify(userData));

        // Fetch and cache user projects on signup (will be empty initially)
        try {
          const projectsRes = await api.get(
            `/api/project/user/${userData._id}`
          );
          localStorage.setItem(
            "userProjects",
            JSON.stringify(projectsRes.data)
          );
          localStorage.setItem("userProjectsTimestamp", Date.now().toString());
        } catch (projErr) {
          console.error("Error caching projects on signup:", projErr);
        }

        navigate("/home");
      } catch (loginErr) {
        // If auto-login fails, still show success and redirect to login
        alert("Account created successfully! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      const updatedErrors = {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      };

      if (err.response?.data) {
        const errorData = err.response.data;
        let errorMessage = "";

        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        // Assign error to appropriate field
        const lowerError = errorMessage.toLowerCase();
        if (lowerError.includes("email") && lowerError.includes("dup")) {
          updatedErrors.email = "This email is already registered";
        } else if (lowerError.includes("username") && lowerError.includes("dup")) {
          updatedErrors.username = "This username is already taken";
        } else if (lowerError.includes("email")) {
          updatedErrors.email = errorMessage;
        } else if (lowerError.includes("username")) {
          updatedErrors.username = errorMessage;
        } else {
          updatedErrors.username = errorMessage || "Error creating account";
        }
      } else {
        updatedErrors.username = "Error creating account";
      }

      setErrors(updatedErrors);
    }
  };

  return (
    <div style={styles.container}>
      <img src={Logo} alt="Logo" style={{ width: 150, marginBottom: 20 }} />
      <div style={styles.title}>Create Your Account</div>

      <form style={styles.form} onSubmit={handleSignUp}>
        <div>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={45}
          />
          {errors.firstName && (
            <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
              {errors.firstName}
            </div>
          )}
        </div>
        
        <div>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            maxLength={45}
          />
          {errors.lastName && (
            <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
              {errors.lastName}
            </div>
          )}
        </div>
        
        <div>
          <TextField
            label="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={45}
          />
          {errors.email && (
            <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
              {errors.email}
            </div>
          )}
        </div>
        
        <div>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={45}
          />
          {errors.username && (
            <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
              {errors.username}
            </div>
          )}
        </div>

        {/* Password field with eye toggle */}
        <div>
          <div style={{ position: "relative" }}>
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
                position: "absolute",
                right: "6px",
                top: "70%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                color: "#666",
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye icon (visible)
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                // Eye-off icon (hidden)
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            Must be at least 6 characters with 1 uppercase letter and 1 special character
          </div>
          
          {errors.password && (
            <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password field with eye toggle */}
        <div>
          <div style={{ position: "relative" }}>
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={45}
            />
            <button
              type="button"
              onMouseDown={() => setShowConfirmPassword(true)}
              onMouseUp={() => setShowConfirmPassword(false)}
              onMouseLeave={() => setShowConfirmPassword(false)}
              onTouchStart={() => setShowConfirmPassword(true)}
              onTouchEnd={() => setShowConfirmPassword(false)}
              style={{
                position: "absolute",
                right: "6px",
                top: "70%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                color: "#666",
              }}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                // Eye icon (visible)
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                // Eye-off icon (hidden)
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>
          
          {errors.confirmPassword && (
            <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <div style={styles.buttonGroup}>
          <PrimaryButton text="Sign Up" type="submit" />
        </div>
      </form>

      <div style={styles.footerText}>
        Already have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/login")}>
          Log in
        </span>
      </div>
    </div>
  );
};

export default SignUp;
