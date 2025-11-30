const MyTasksStyle = {
  container: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  layout: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ddf9ea",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#DDF9EA",
    overflowX: "auto",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  swimlaneContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    alignItems: "start",
    width: "100%",
  },
  swimlane: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "12px",
    minWidth: "0",
    maxWidth: "100%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    minHeight: "300px",
    height: "fit-content",
  },  
  swimlaneTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  taskCard: {
    backgroundColor: "#ffffff",
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
