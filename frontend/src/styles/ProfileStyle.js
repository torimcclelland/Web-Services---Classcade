
const ProfileStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#f3f4f6', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  profilePanel: {
    backgroundColor: '#e5e7eb', 
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '1.5rem',
  },
  infoRow: {
    fontSize: 16,
    color: '#111827',
    marginBottom: '0.75rem',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
    gap: '1rem',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#e5e7eb', 
    borderRadius: 12,
    padding: '2rem',
    textAlign: 'center',
    width: '90%',
    maxWidth: 300,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  popupText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#111827',
  },
};

export default ProfileStyle;
