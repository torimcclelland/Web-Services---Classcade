const AddNewTaskStyle = {
  container: {
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  layout: {
    display: 'flex',
    flex: 1,
  },
  main: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: 500,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: 8,
    marginTop: 4,
    borderRadius: 6,
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: 8,
    marginTop: 4,
    borderRadius: 6,
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
};

export default AddNewTaskStyle;