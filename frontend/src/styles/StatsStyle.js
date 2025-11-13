const StatsStyle = {
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
    padding: "2rem",
    backgroundColor: "#ddf9ea",
    overflowY: "auto",
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#1f2937",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#e5e7eb",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "2rem",
  },

  chartsWrapper: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "2rem",
  },

  chartBox: {
    backgroundColor: "#e5e7eb",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    minWidth: "300px",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryBox: {
    backgroundColor: "#e5e7eb",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "2rem",
  },

  summaryText: {
    fontSize: "1rem",
    marginBottom: ".5rem",
    color: "#111827",
  },

  select: {
    width: "250px",
    padding: "0.6rem .75rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    fontWeight: 500,
    marginBottom: "1rem",
    background: "#fff",
    color: "#111827",
  },

  tableWrapper: {
    backgroundColor: "#e5e7eb",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    overflowX: "auto",
    marginTop: "1.5rem",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95rem",
  },

  th: {
    padding: "12px",
    fontWeight: 700,
    backgroundColor: "#f3f4f6",
    borderBottom: "2px solid #d1d5db",
    textAlign: "left",
    color: "#1f2937",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #d1d5db",
    color: "#111827",
  },

  tableRowHover: {
    backgroundColor: "#f9fafb",
  },

  toast: {
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: 600,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    opacity: 1,
    zIndex: 2000,
    animation: "fadeOut 2s forwards",
  },

  "@keyframes fadeOut": {
    "0%": { opacity: 1, transform: "translateY(0px)" },
    "80%": { opacity: 1, transform: "translateY(-4px)" },
    "100%": { opacity: 0, transform: "translateY(-8px)" },
  },
};

export default StatsStyle;
