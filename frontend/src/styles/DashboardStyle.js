export const DashboardStyle = {
  container: {
    backgroundColor: '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  layout: {
    display: 'flex',
    flex: 1,
  },
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#f3f4f6', // light gray
  },
  statsPanel: {
    backgroundColor: '#e5e7eb', // gray rectangle
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  progressBar: {
    backgroundColor: '#d1d5db',
    borderRadius: '6px',
    height: '10px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressFill: {
    backgroundColor: '#1e3a8a',
    height: '100%',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
  },

};

export default DashboardStyle;