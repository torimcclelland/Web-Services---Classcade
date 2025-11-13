const DashboardStyle = {
  container: {
    backgroundColor: "#ddf9ea",
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
    padding: "2rem",
    backgroundColor: "#ddf9ea",
  },
  statsPanel: {
    backgroundColor: "#e5e7eb",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginTop: "1rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontWeight: 600,
    marginBottom: "0.5rem",
  },
  progressBar: {
    backgroundColor: "#d1d5db",
    borderRadius: "8px",
    height: "10px",
    overflow: "hidden",
    width: "100%",
    marginBottom: "0.5rem",
    position: "relative",
  },
  progressFill: {
    backgroundColor: "#1e3a8a",
    height: "100%",
    transition: "width 0.4s ease-in-out",
    display: "block",
    minWidth: "2px",
  },
  actionButtons: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
    flexWrap: "wrap",
  },
  profileHeader: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1rem",
  },
};

export default DashboardStyle;
