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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    inset: 0,
    padding: 24,
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/user/login", { username, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
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
        />

        <TextField
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
