import React from 'react';
import Logo from '../assets/Logo.png';
import LogoutImg from '../assets/Logout.png';

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
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#e53935',
    fontSize: 35,
    cursor: 'pointer'
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
    position: 'absolute',
    top: -10,
    left: 20,
    width: 0,
    height: 0,
    backgroundColor: '#DDF9EA',
    border: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    color: '#0F3E2D',
    fontWeight: 'bold',
  }
};

const groups = [
  { id: 1, name: 'SWENG', status: 'In progress', modified: 'yesterday' },
  { id: 2, name: 'COMPSCI', status: 'In progress', modified: '1 week ago' },
  { id: 3, name: 'GROUP 3', status: 'Complete', modified: '3 years ago' },
];

const HomePage = () => {
  const handleCardClick = (groupId, groupName) => {
    console.log(`Card clicked: ${groupName} (ID: ${groupId})`);
    // TODO: Navigate to group dashboard
  };

  const handleDeleteClick = (e, groupId, groupName) => {
    e.stopPropagation(); // Prevent card click when delete is clicked
    console.log(`Delete clicked: ${groupName} (ID: ${groupId})`);
    // TODO: Show confirmation dialog and delete group
  };

  const handleNewGroupClick = () => {
    console.log('New Group button clicked');
    // TODO: Open new page window
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    // TODO: Open login page
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <button 
          style={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Logout"
        >
          <img src={LogoutImg} alt="logout" style={{ width: 26, height: 31 }} />
        </button>
        <img src={Logo} alt="logo" style={{ width: 120, height: 120 }} />

        <h1 style={styles.heading}>Welcome to CLASSCADE John!</h1>
        <div style={styles.subtitle}>Click a group or create a new one to get started</div>

        <div style={styles.list}>
          {groups.map((g) => (
            <div 
              key={g.id} 
              style={styles.card}
              onClick={() => handleCardClick(g.id, g.name)}
            >
              <div style={styles.cardLeft}>
                <div style={styles.badge}>{g.id}.</div>
                <div style={styles.cardContent}>
                  <div style={styles.cardTitle}>{g.name}</div>
                  <div style={styles.cardMeta}>
                    <div style={styles.metaText}>Status: {g.status}</div>
                    <div style={styles.metaText}>Last Modified: {g.modified}</div>
                  </div>
                </div>
              </div>
              <button 
                style={styles.deleteBtn} 
                aria-label={`delete ${g.name}`}
                onClick={(e) => handleDeleteClick(e, g.id, g.name)}
              >
                &#128465;
              </button>
            </div>
          ))}
        </div>

        <button style={styles.newGroupBtn} onClick={handleNewGroupClick}>
          + New Group
        </button>
      </div>
    </div>
  );
};

export default HomePage;