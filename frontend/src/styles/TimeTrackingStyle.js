export const TimeTrackingStyle = {
  container: {
    backgroundColor: "#f3f4f6",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  layout: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ddf9ea",
  },
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#ddf9ea', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  formPanel: {
    backgroundColor: "#ffffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: 500,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: "1rem",
    textAlign: "center",
    color: "#1f2937",
  },
  label: {
    fontWeight: 600,
    marginBottom: "0.25rem",
    color: "#111827",
  },
  select: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    border: "2px solid #d1d5db",
    fontSize: 16,
  },
  input: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    border: "2px solid #d1d5db",
    fontSize: 16,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.5rem",
  },
  switchLabel: {
    fontWeight: 600,
  },
  toggle: {
    position: "relative",
    width: 50,
    height: 25,
    borderRadius: 25,
    cursor: "pointer",
    transition: "background 0.3s",
  },
  toggleCircle: {
    position: "absolute",
    top: 3,
    width: 19,
    height: 19,
    backgroundColor: "#fff",
    borderRadius: "50%",
    transition: "left 0.3s",
  },
  actionButtons: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
    justifyContent: "center",
  },

  popupContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },

  popupMessage: {
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: 600,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    opacity: 1,
    animation: "fadeOut 2s forwards",
  },

  "@keyframes fadeOut": {
    "0%": { opacity: 1, transform: "translateY(0px)" },
    "80%": { opacity: 1, transform: "translateY(-4px)" },
    "100%": { opacity: 0, transform: "translateY(-8px)" },
  },
};

export default TimeTrackingStyle;
