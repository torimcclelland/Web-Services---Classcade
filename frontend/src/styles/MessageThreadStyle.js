const MessageThreadStyle = {
  container: {
    backgroundColor: "#f3f4f6",
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
    backgroundColor: "#f3f4f6",
    display: "flex",
    flexDirection: "column",
  },
  backButton: {
    marginBottom: "1rem",
    backgroundColor: "#e5e7eb",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  messageBubble: {
    backgroundColor: "#e5e7eb",
    padding: "1rem",
    borderRadius: "8px",
    maxWidth: "60%",
  },
  inputArea: {
    display: "flex",
    marginTop: "1rem",
    gap: "1rem",
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  sendButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1e3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default MessageThreadStyle;