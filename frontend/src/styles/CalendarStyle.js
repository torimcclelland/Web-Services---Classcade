const CalendarStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  layout: {
    display: 'flex',
    flex: 1,
  },
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#f3f4f6',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
  },
  controls: {
    display: 'flex',
    gap: '0.5rem',
  },
  navButton: {
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e5e7eb',
    cursor: 'pointer',
    fontWeight: 600,
  },
  toggleButton: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  },
  calendarPanel: {
    backgroundColor: '#e5e7eb',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  // WEEK VIEW
  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  dayHeader: {
    padding: '0.5rem 0',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  weekBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  timeRow: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  timeLabel: {
    width: '60px',
    fontSize: 12,
    textAlign: 'right',
    marginRight: '0.5rem',
    color: '#374151',
  },
  timeCells: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.25rem',
    flex: 1,
  },
  timeCell: {
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    height: '40px',
    border: '1px solid #d1d5db',
  },
  // MONTH VIEW
  monthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem',
  },
  monthDay: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '0.5rem',
    minHeight: '80px',
    border: '1px solid #d1d5db',
  },
  dateNumber: {
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
};

export default CalendarStyle;
