const TopNavBarStyle = {
    topNavbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 1rem',
      backgroundColor: '#e0f7e9', //light green
      borderBottom: '1px solid #ccc',
    },
    homeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
    },
    exitBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
    },
    groupTabs: {
      display: 'flex',
      gap: '0.75rem',
      flexGrow: 1,
      justifyContent: 'center',
    },
    groupTab: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: '0.25rem 0.5rem',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    closeTabBtn: {
      background: 'none',
      border: 'none',
      fontSize: '0.9rem',
      marginLeft: '0.5rem',
      cursor: 'pointer',
    },
    addTabBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
    },
    activeTab: {
      backgroundColor: '#C8E6C9',
      fontWeight: '700',
    }
  };
  
  export default TopNavBarStyle;
  