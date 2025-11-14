const TopNavBarStyle = {
  topNavbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
    backgroundColor: "#e0f7e9", //light green
    borderBottom: "1px solid #ccc",
  },
  homeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  exitBtn: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  projectTabs: {
    display: "flex",
    gap: "0.75rem",
    flexGrow: 1,
    justifyContent: "center",
  },
  projectTab: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "0.25rem 0.5rem",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  closeTabBtn: {
    background: "none",
    border: "none",
    fontSize: "0.9rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
  },
  addTabBtn: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  activeTab: {
    backgroundColor: "#C8E6C9",
    fontWeight: "700",
  },
  tabHover: {
    backgroundColor: '#2c4fb2',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
  },
  newProjectHover: {
    backgroundColor: '#dcd4d4ff',
  },
  homeHover: {
    backgroundColor: '#dcd4d4ff',
  }
};

export default TopNavBarStyle;
