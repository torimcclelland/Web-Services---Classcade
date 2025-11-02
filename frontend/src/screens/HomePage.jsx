import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import LogoutImg from '../assets/Logout.png';
import api from '../api';
import { useProject } from "../context/ProjectContext";

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#DDF9EA',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'auto',
  },
  inner: {
    width: '100%',
    maxWidth: 1000,
    marginTop: 40,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    position: 'relative',
  },
  heading: {
    fontSize: 44,
    fontWeight: 800,
    margin: 0,
    color: '#0F3E2D',
    textAlign: 'center',
    fontFamily: 'Inter, Arial, sans-serif'
  },
  subtitle: {
    color: '#2e7d32',
    fontSize: 18,
    marginTop: -8,
    textAlign: 'center'
  },
  list: {
    width: '100%',
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '16px 20px',
    border: '1px solid #a3b7acff',
    boxShadow: '0 2px 0 rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    cursor: 'pointer'
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  badge: {
    width: 40,
    height: 36,
    borderRadius: 8,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 24,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 600,
  },
  cardMeta: {
    display: 'flex',
    gap: 24,
    color: '#333',
    alignItems: 'center'
  },
  metaText: {
    fontStyle: 'italic',
  },
  newGroupBtn: {
    marginLeft: 20,
    padding: '12px 24px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #a3b7acff',
    boxShadow: '0 2px 0 rgba(0,0,0,0.06)',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  logoutBtn: {
    position: 'fixed',
    top: 12,
    left: 8,
    width: 50,
    height: 50,
    backgroundColor: '#DDF9EA',
    border: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    color: '#0F3E2D',
    fontWeight: 'bold',
    zIndex: 9999,
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  const { setCurrentProject } = useProject();

  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      const res = await api.get(`/api/project/user/${user._id}`);
      setGroups(res.data || []);
    } catch (e) {
      console.error("Error fetching projects", e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCardClick = (project) => {
    setCurrentProject(project);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("currentProject");
    setCurrentProject(null);
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <img src={LogoutImg} alt="logout" style={{ width: 26, height: 31 }} />
        </button>

        <img src={Logo} alt="logo" style={{ width: 120, height: 120 }} />

        <h1 style={styles.heading}>Welcome to CLASSCADE!</h1>
        <div style={styles.subtitle}>Click a group or create a new one to get started</div>

        <div style={styles.list}>
          {groups.map((g, index) => (
            <div 
              key={g._id || index}
              style={styles.card}
              onClick={() => handleCardClick(g)}
            >
              <div style={styles.cardLeft}>
                <div style={styles.badge}>{index + 1}.</div>
                <div style={styles.cardContent}>
                  <div style={styles.cardTitle}>{g.name}</div>
                  <div style={styles.cardMeta}>
                    <div style={styles.metaText}>Members: {g.members?.length || 0}</div>
                    <div style={styles.metaText}>Status: {g.status || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          style={styles.newGroupBtn} 
          onClick={() => navigate("/addnewproject")}
        >
          + New Group
        </button>
      </div>
    </div>
  );
};

export default HomePage;