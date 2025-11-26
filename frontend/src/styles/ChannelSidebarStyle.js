const ChannelSidebarStyle = {
    sidebar: {
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e5e7eb',
        transition: 'width 0.3s ease',
        position: 'relative',
        flexShrink: 0,
        height: '100%',
    },

    sidebarExpanded: {
        width: '240px',
    },

    sidebarCollapsed: {
        width: '60px',
    },

    toggleButton: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        color: '#6b7280',
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '600',
        transition: 'all 0.2s',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        flexShrink: 0,
        lineHeight: '1.2',
    },

    header: {
        padding: '1rem 12px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: '73px',
        boxSizing: 'border-box',
        gap: '8px',
    },

    headerText: {
        fontSize: '0.6875rem',
        fontWeight: '700',
        color: '#6b7280',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        flex: 1,
        lineHeight: '1.2',
    },

    headerButtons: {
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
    },

    addButton: {
        background: '#1e3a8a',
        border: 'none',
        color: '#ffffff',
        fontSize: '1rem',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        fontWeight: '600',
        lineHeight: '1',
        flexShrink: 0,
    },

    channelList: {
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '8px',
        backgroundColor: '#f9fafb',
    },

    channelItem: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '2px 0',
        borderRadius: '6px',
        transition: 'all 0.15s',
        color: '#6b7280',
        fontSize: '0.9375rem',
        position: 'relative',
    },

    channelItemExpanded: {
        padding: '8px 12px',
    },

    channelItemCollapsed: {
        padding: '10px',
        justifyContent: 'center',
    },

    channelItemActive: {
        backgroundColor: '#ffffff',
        color: '#1e3a8a',
        fontWeight: '600',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },

    channelItemHover: {
        backgroundColor: '#ffffff',
        color: '#374151',
    },

    channelContent: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: 0,
        overflow: 'hidden',
    },

    channelHash: {
        fontSize: '1rem',
        fontWeight: '700',
        color: 'inherit',
        flexShrink: 0,
        lineHeight: '1',
    },

    channelName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lineHeight: '1.5',
    },

    menuButton: {
        background: 'none',
        border: 'none',
        color: '#9ca3af',
        cursor: 'pointer',
        padding: '4px 6px',
        fontSize: '1rem',
        borderRadius: '4px',
        transition: 'all 0.2s',
        opacity: 0,
        flexShrink: 0,
        lineHeight: '1',
    },

    menuButtonVisible: {
        opacity: 1,
    },

    dropdownMenu: {
        position: 'absolute',
        right: '10px',
        top: '100%',
        marginTop: '4px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 100,
        minWidth: '140px',
        overflow: 'hidden',
    },

    dropdownItem: {
        width: '100%',
        padding: '10px 16px',
        background: 'none',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '0.875rem',
        color: '#374151',
        transition: 'background-color 0.15s',
        lineHeight: '1.5',
    },

    dropdownItemDelete: {
        color: '#dc2626',
    },

    editInput: {
        flex: 1,
        background: '#ffffff',
        border: '2px solid #1e3a8a',
        color: '#374151',
        padding: '6px 8px',
        borderRadius: '6px',
        fontSize: '0.9375rem',
        outline: 'none',
        lineHeight: '1.5',
    },

    createSection: {
        padding: '12px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
    },

    createInput: {
        width: '100%',
        padding: '8px 10px',
        paddingRight: '40px',
        marginBottom: '8px',
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.9375rem',
        color: '#374151',
        outline: 'none',
        transition: 'border-color 0.2s',
        lineHeight: '1.5',
        boxSizing: 'border-box',
    },

    characterCount: {
        position: 'absolute',
        top: '20px',
        right: '22px',
        fontSize: '0.6875rem',
        color: '#9ca3af',
        pointerEvents: 'none',
        lineHeight: '1.2',
    },

    characterCountWarning: {
        color: '#dc2626',
    },


    createButtons: {
        display: 'flex',
        gap: '8px',
    },

    createButton: {
        flex: 1,
        padding: '8px',
        backgroundColor: '#1e3a8a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.8125rem',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        lineHeight: '1.2',
    },

    cancelButton: {
        flex: 1,
        padding: '8px',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.8125rem',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        lineHeight: '1.2',
    },

    tooltip: {
        position: 'absolute',
        left: '65px',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '0.8125rem',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lineHeight: '1.2',
    },

    emptyState: {
        padding: '20px 12px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.8125rem',
        fontStyle: 'italic',
        lineHeight: '1.5',
    },
};

export default ChannelSidebarStyle;
