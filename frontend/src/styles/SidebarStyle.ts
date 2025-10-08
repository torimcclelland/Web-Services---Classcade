.sidebar {
  background-color: #1e3a8a; /* Deep blue */
  color: white;
  width: 220px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.logo img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.navLinks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.navLink {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.navLink:hover {
  background-color: #2c4fb2;
}
