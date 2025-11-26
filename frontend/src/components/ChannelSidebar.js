import React, { useState } from "react";
import api from "../api";

const ChannelSidebar = ({
    channels,
    activeChannelId,
    onChannelSelect,
    projectId,
    onChannelsUpdate,
    isCollapsed,
    onToggleCollapse
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [editingChannelId, setEditingChannelId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [hoveredChannelId, setHoveredChannelId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const handleCreateChannel = async () => {
        if (!newChannelName.trim()) {
            alert("Channel name cannot be empty");
            return;
        }

        try {
            const res = await api.post(`/api/project/${projectId}/channels`, {
                name: newChannelName.trim(),
                description: ''
            });

            onChannelsUpdate([...channels, res.data]);
            setNewChannelName("");
            setIsCreating(false);
            onChannelSelect(res.data._id);
        } catch (err) {
            console.error("Error creating channel:", err);
            alert(`Failed to create channel: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleUpdateChannel = async (channelId, newName) => {
        if (!newName.trim()) {
            setEditingChannelId(null);
            return;
        }

        try {
            await api.put(`/api/channels/${channelId}`, {
                name: newName.trim()
            });

            const updated = channels.map(c =>
                c._id === channelId ? { ...c, name: newName.trim() } : c
            );
            onChannelsUpdate(updated);
            setEditingChannelId(null);
        } catch (err) {
            console.error("Error updating channel:", err);
            alert("Failed to update channel");
        }
    };

    const handleDeleteChannel = async (channelId) => {
        const channelName = channels.find(c => c._id === channelId)?.name;

        // Prevent deleting the general channel
        if (channelName?.toLowerCase() === 'general') {
            alert("Cannot delete the general channel!");
            return;
        }

        if (!window.confirm(`Delete #${channelName}? All messages will be permanently lost.`)) {
            return;
        }

        try {
            await api.delete(`/api/channels/${channelId}`);

            const filtered = channels.filter(c => c._id !== channelId);
            onChannelsUpdate(filtered);

            // Switch to general channel if deleting active channel
            if (activeChannelId === channelId) {
                const generalChannel = filtered.find(c => c.name.toLowerCase() === 'general');
                if (generalChannel) {
                    onChannelSelect(generalChannel._id);
                } else if (filtered.length > 0) {
                    onChannelSelect(filtered[0]._id);
                }
            }

            setOpenMenuId(null);
        } catch (err) {
            console.error("Error deleting channel:", err);
            alert("Failed to delete channel");
        }
    };

    const styles = {
        sidebar: {
            width: isCollapsed ? '50px' : '240px',
            backgroundColor: '#2c2f33',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #1e2124',
            transition: 'width 0.3s ease',
            position: 'relative',
            flexShrink: 0,
        },
        toggleButton: {
            position: 'absolute',
            top: '10px',
            right: isCollapsed ? '10px' : '10px',
            background: '#40444b',
            border: 'none',
            color: '#dcddde',
            padding: '8px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: 10,
            transition: 'background-color 0.2s',
        },
        header: {
            padding: isCollapsed ? '50px 8px 16px 8px' : '50px 12px 16px 12px',
            borderBottom: '1px solid #1e2124',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2c2f33',
        },
        headerText: {
            fontSize: '12px',
            fontWeight: '700',
            color: '#8e9297',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            display: isCollapsed ? 'none' : 'block',
        },
        addButton: {
            background: 'none',
            border: 'none',
            color: '#dcddde',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            display: isCollapsed ? 'none' : 'block',
        },
        channelList: {
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '8px 0',
        },
        channelItem: {
            padding: isCollapsed ? '10px 8px' : '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            margin: '1px 6px',
            borderRadius: '4px',
            transition: 'background-color 0.15s',
            color: '#8e9297',
            fontSize: '14px',
            position: 'relative',
        },
        channelItemActive: {
            backgroundColor: '#40444b',
            color: '#ffffff',
        },
        channelItemHover: {
            backgroundColor: '#36393f',
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
            fontSize: '18px',
            fontWeight: '700',
            color: '#8e9297',
            flexShrink: 0,
        },
        channelName: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: isCollapsed ? 'none' : 'block',
        },
        menuButton: {
            background: 'none',
            border: 'none',
            color: '#8e9297',
            cursor: 'pointer',
            padding: '4px 6px',
            fontSize: '18px',
            borderRadius: '4px',
            transition: 'all 0.2s',
            opacity: 0,
            flexShrink: 0,
            display: isCollapsed ? 'none' : 'flex',
        },
        menuButtonVisible: {
            opacity: 1,
        },
        dropdownMenu: {
            position: 'absolute',
            right: '10px',
            top: '100%',
            marginTop: '4px',
            backgroundColor: '#18191c',
            border: '1px solid #040405',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            zIndex: 100,
            minWidth: '160px',
            overflow: 'hidden',
        },
        dropdownItem: {
            width: '100%',
            padding: '10px 12px',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#dcddde',
            transition: 'background-color 0.15s',
        },
        dropdownItemDelete: {
            color: '#ed4245',
        },
        editInput: {
            flex: 1,
            background: '#40444b',
            border: '1px solid #1e2124',
            color: '#dcddde',
            padding: '6px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            outline: 'none',
        },
        createSection: {
            padding: '12px',
            backgroundColor: '#2c2f33',
            borderTop: '1px solid #1e2124',
            display: isCollapsed ? 'none' : 'block',
        },
        createInput: {
            width: '100%',
            padding: '8px 10px',
            marginBottom: '8px',
            background: '#40444b',
            border: '1px solid #1e2124',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#dcddde',
            outline: 'none',
        },
        createButtons: {
            display: 'flex',
            gap: '6px',
        },
        createButton: {
            flex: 1,
            padding: '8px',
            backgroundColor: '#5865f2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
        },
        cancelButton: {
            flex: 1,
            padding: '8px',
            backgroundColor: '#4e5058',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
        },
        tooltip: {
            position: 'absolute',
            left: '60px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#18191c',
            color: '#dcddde',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
        },
    };

    return (
        <div style={styles.sidebar}>
            {/* Toggle button */}
            <button
                onClick={onToggleCollapse}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5865f2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#40444b'}
                style={styles.toggleButton}
                title={isCollapsed ? "Expand" : "Collapse"}
            >
                {isCollapsed ? '>' : '<'}
            </button>

            {/* Header */}
            <div style={styles.header}>
                <span style={styles.headerText}>TEXT CHANNELS</span>
                <button
                    onClick={() => setIsCreating(true)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40444b'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    style={styles.addButton}
                    title="Create Channel"
                >
                    +
                </button>
            </div>

            {/* Channel list */}
            <div style={styles.channelList}>
                {channels.length === 0 && !isCreating && !isCollapsed && (
                    <div style={{
                        padding: '20px 12px',
                        textAlign: 'center',
                        color: '#8e9297',
                        fontSize: '13px',
                        fontStyle: 'italic'
                    }}>
                        No channels yet
                    </div>
                )}

                {channels.map(channel => {
                    const isActive = activeChannelId === channel._id;
                    const isHovered = hoveredChannelId === channel._id;
                    const isEditing = editingChannelId === channel._id;
                    const isGeneral = channel.name.toLowerCase() === 'general';

                    return (
                        <div
                            key={channel._id}
                            style={{
                                ...styles.channelItem,
                                ...(isActive && styles.channelItemActive),
                                ...(isHovered && !isActive && styles.channelItemHover),
                            }}
                            onMouseEnter={() => setHoveredChannelId(channel._id)}
                            onMouseLeave={() => setHoveredChannelId(null)}
                        >
                            {isEditing && !isCollapsed ? (
                                <input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => handleUpdateChannel(channel._id, editingName)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUpdateChannel(channel._id, editingName);
                                        } else if (e.key === 'Escape') {
                                            setEditingChannelId(null);
                                        }
                                    }}
                                    autoFocus
                                    style={styles.editInput}
                                />
                            ) : (
                                <>
                                    <div
                                        onClick={() => onChannelSelect(channel._id)}
                                        style={styles.channelContent}
                                    >
                                        <span style={styles.channelHash}>#</span>
                                        <span style={styles.channelName}>{channel.name}</span>
                                    </div>

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && isHovered && (
                                        <div style={styles.tooltip}>
                                            {channel.name}
                                        </div>
                                    )}

                                    {/* Channel menu - only for non-general channels */}
                                    {!isGeneral && !isCollapsed && (
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === channel._id ? null : channel._id);
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40444b'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                style={{
                                                    ...styles.menuButton,
                                                    ...((isHovered || openMenuId === channel._id) && styles.menuButtonVisible)
                                                }}
                                            >
                                                ...
                                            </button>

                                            {openMenuId === channel._id && (
                                                <>
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(null);
                                                        }}
                                                        style={{
                                                            position: 'fixed',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            zIndex: 99,
                                                        }}
                                                    />

                                                    <div style={styles.dropdownMenu}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingChannelId(channel._id);
                                                                setEditingName(channel.name);
                                                                setOpenMenuId(null);
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4e5058'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                            style={styles.dropdownItem}
                                                        >
                                                            Rename
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteChannel(channel._id);
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ed4245'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                            style={{
                                                                ...styles.dropdownItem,
                                                                ...styles.dropdownItemDelete,
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Create channel section */}
            {isCreating && (
                <div style={styles.createSection}>
                    <input
                        placeholder="channel-name"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCreateChannel();
                            } else if (e.key === 'Escape') {
                                setIsCreating(false);
                                setNewChannelName("");
                            }
                        }}
                        autoFocus
                        style={styles.createInput}
                    />
                    <div style={styles.createButtons}>
                        <button
                            onClick={handleCreateChannel}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4752c4'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5865f2'}
                            style={styles.createButton}
                        >
                            Create
                        </button>
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setNewChannelName("");
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d6f78'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4e5058'}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChannelSidebar;
