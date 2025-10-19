const DashboardStyle = {
  pageWrapper: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f0f4f8',
  },

  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  dashboardPanel: {
    padding: '2rem',
    backgroundColor: '#ffffff',
    margin: '1rem',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  },

  title: {
    fontSize: '1.6rem',
    fontWeight: 600,
    color: '#1e3a8a',
    marginBottom: '1.5rem',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },

  statBox: {
    backgroundColor: '#f9fafc',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },

  statLabel: {
    fontSize: '0.85rem',
    color: '#555',
    marginBottom: '0.25rem',
    display: 'block',
  },

  statValue: {
    fontSize: '1.1rem',
    fontWeight: 500,
    color: '#1e3a8a',
  },

  progressBar: {
    backgroundColor: '#e0e0e0',
    borderRadius: '6px',
    height: '10px',
    margin: '0.5rem 0',
    overflow: 'hidden',
  },

  progressFill: {
    backgroundColor: '#1e3a8a',
    height: '100%',
    borderRadius: '6px',
  },

  buttonRow: {
    display: 'flex',
    gap: '1rem',
  },
};

export default DashboardStyle;



