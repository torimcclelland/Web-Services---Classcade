const MessagesOverviewStyle = {
  container: {
    backgroundColor: "#ddf9ea",
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
    backgroundColor: "#ddf9ea",
  },
  header: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  chatList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    overflowY: "auto",
    maxHeight: "80vh",
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    padding: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    position: "relative",
  },
  chatText: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  unreadDot: {
    width: "10px",
    height: "10px",
    backgroundColor: "red",
    borderRadius: "50%",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
};

export default MessagesOverviewStyle;