const MyTasksStyle = {
  container: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  layout: {
    display: "flex",
    flex: 1,
  },
  main: {
    flex: 1,
    padding: "2rem",
    backgroundColor: "#DDF9EA",
    overflowX: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  swimlaneContainer: {
    display: "flex",
    gap: "1.5rem",
  },
  swimlane: {
    flex: "1 1 0",
    backgroundColor: "#f3f4f6",
    padding: "1rem",
    borderRadius: "12px",
    minWidth: "250px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  swimlaneTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  taskCard: {
    backgroundColor: "white",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
  },  
  taskTitle: {
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  taskDescription: {
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
  },
  taskDueDate: {
    fontSize: "0.8rem",
    color: "#555",
  },
};

export default MyTasksStyle;
