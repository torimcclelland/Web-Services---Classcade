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
    backgroundColor: "#ffffffff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.04)",
    marginBottom: "1.5rem",
  },

  chartsWrapper: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },

  chartBox: {
    backgroundColor: "#ffffffff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.04)",
    minWidth: "280px",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryBox: {
    backgroundColor: "#ffffffff",
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
    backgroundColor: "#ffffffff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.04)",
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
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
    color: "#1f2937",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
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
  emptyState: {
    backgroundColor: "#fff",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
    marginTop: "2rem",
  },
  
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "1rem",
  },
  
  emptyText: {
    fontSize: "1rem",
    color: "#4b5563",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "1.5rem",
  },
  metricCard: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.04)",
  },
  metricLabel: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: 700,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 4,
  },
  metricSub: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
    fontWeight: 600,
  },
  metricChips: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 4,
  },
  metricChip: {
    padding: "6px 8px",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
  },
  filtersRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
  },
  filterInput: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
  },
  filterCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 600,
    color: "#1f2937",
  },
  trendsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
    marginBottom: 12,
  },
  legendRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 12,
    marginTop: 6,
    color: "#4b5563",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    display: "inline-block",
  },
  splitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 8,
  },
  riskGroup: {
    marginTop: 8,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 8,
  },
  riskHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 6,
  },
  riskItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f3f4f6",
    gap: 8,
  },
  riskTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: "#111827",
  },
  riskMeta: {
    fontSize: 12,
    color: "#6b7280",
  },
  riskBadges: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  riskEmpty: {
    fontSize: 13,
    color: "#6b7280",
    padding: "4px 0",
  },
  priorityPill: {
    padding: "6px 8px",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
  },
  priorityColors: {
    High: { backgroundColor: "#fee2e2", color: "#b91c1c" },
    Medium: { backgroundColor: "#fef3c7", color: "#92400e" },
    Low: { backgroundColor: "#d1fae5", color: "#065f46" },
  },
  assigneePill: {
    padding: "6px 8px",
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    color: "#111827",
    fontSize: 12,
    fontWeight: 700,
  },
  matrix: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  matrixHeader: {
    display: "grid",
    gridTemplateColumns: "120px repeat(3, 1fr)",
    gap: 6,
    fontWeight: 700,
    fontSize: 13,
    color: "#374151",
    paddingBottom: 6,
    borderBottom: "1px solid #e5e7eb",
    justifyItems: "center",
  },
  matrixRow: {
    display: "grid",
    gridTemplateColumns: "120px repeat(3, 1fr)",
    gap: 6,
    alignItems: "center",
    fontSize: 13,
    color: "#111827",
    padding: "4px 0",
  },
  matrixLabel: {
    fontWeight: 700,
  },
  matrixCell: {
    textAlign: "center",
    padding: "6px",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    fontWeight: 700,
  },
  memberGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 8,
  },
  memberCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px",
    backgroundColor: "#f8fafc",
  },
  memberName: {
    fontWeight: 700,
    marginBottom: 6,
    color: "#0f172a",
  },
  memberStats: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    fontSize: 12,
    color: "#374151",
    fontWeight: 600,
  },
  
};
export default StatsStyle;
