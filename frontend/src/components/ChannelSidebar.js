import React, { useState } from "react";
import api from "../api";
import ChannelSidebarStyle from "../styles/ChannelSidebarStyle";

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

    const MAX_CHANNEL_NAME_LENGTH = 50;

    const handleCreateChannel = async () => {
        if (!newChannelName.trim()) {
            alert("Channel name cannot be empty");
            return;
        }

        if (newChannelName.trim().length > MAX_CHANNEL_NAME_LENGTH) {
            alert(`Channel name must be ${MAX_CHANNEL_NAME_LENGTH} characters or less`);
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

        if (newName.trim().length > MAX_CHANNEL_NAME_LENGTH) {
            alert(`Channel name must be ${MAX_CHANNEL_NAME_LENGTH} characters or less`);
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

    const sidebarStyle = {
        ...ChannelSidebarStyle.sidebar,
        ...(isCollapsed ? ChannelSidebarStyle.sidebarCollapsed : ChannelSidebarStyle.sidebarExpanded),
    };

    return (
        <div style={sidebarStyle}>
            {/* Header */}
            <div style={ChannelSidebarStyle.header}>
                {!isCollapsed ? (
                    <>
                        <span style={ChannelSidebarStyle.headerText}>CHANNELS</span>
                        <div style={ChannelSidebarStyle.headerButtons}>
                            <button
                                onClick={() => setIsCreating(true)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                                style={ChannelSidebarStyle.addButton}
                                title="Create Channel"
                            >
                                +
                            </button>
                            <button
                                onClick={onToggleCollapse}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                                style={ChannelSidebarStyle.toggleButton}
                                title="Collapse"
                            >
                                &lt;
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={onToggleCollapse}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        style={ChannelSidebarStyle.toggleButton}
                        title="Expand"
                    >
                        &gt;
                    </button>
                )}
            </div>

            {/* Channel list */}
            <div style={ChannelSidebarStyle.channelList}>
                {channels.length === 0 && !isCreating && !isCollapsed && (
                    <div style={ChannelSidebarStyle.emptyState}>
                        No channels yet
                    </div>
                )}

                {channels.map(channel => {
                    const isActive = activeChannelId === channel._id;
                    const isHovered = hoveredChannelId === channel._id;
                    const isEditing = editingChannelId === channel._id;
                    const isGeneral = channel.name.toLowerCase() === 'general';

                    const itemStyle = {
                        ...ChannelSidebarStyle.channelItem,
                        ...(isCollapsed ? ChannelSidebarStyle.channelItemCollapsed : ChannelSidebarStyle.channelItemExpanded),
                        ...(isActive && ChannelSidebarStyle.channelItemActive),
                        ...(isHovered && !isActive && ChannelSidebarStyle.channelItemHover),
                    };

                    return (
                        <div
                            key={channel._id}
                            style={itemStyle}
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
                                    maxLength={MAX_CHANNEL_NAME_LENGTH}
                                    autoFocus
                                    style={ChannelSidebarStyle.editInput}
                                />
                            ) : (
                                <>
                                    <div
                                        onClick={() => onChannelSelect(channel._id)}
                                        style={ChannelSidebarStyle.channelContent}
                                    >
                                        <span style={ChannelSidebarStyle.channelHash}>#</span>
                                        {!isCollapsed && (
                                            <span style={ChannelSidebarStyle.channelName}>{channel.name}</span>
                                        )}
                                    </div>

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && isHovered && (
                                        <div style={ChannelSidebarStyle.tooltip}>
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
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                style={{
                                                    ...ChannelSidebarStyle.menuButton,
                                                    ...((isHovered || openMenuId === channel._id) && ChannelSidebarStyle.menuButtonVisible)
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

                                                    <div style={ChannelSidebarStyle.dropdownMenu}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingChannelId(channel._id);
                                                                setEditingName(channel.name);
                                                                setOpenMenuId(null);
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                            style={ChannelSidebarStyle.dropdownItem}
                                                        >
                                                            Rename
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteChannel(channel._id);
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                            style={{
                                                                ...ChannelSidebarStyle.dropdownItem,
                                                                ...ChannelSidebarStyle.dropdownItemDelete,
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
            {isCreating && !isCollapsed && (
                <div style={ChannelSidebarStyle.createSection}>
                    <div style={{ position: 'relative' }}>
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
                            onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            maxLength={MAX_CHANNEL_NAME_LENGTH}
                            autoFocus
                            style={ChannelSidebarStyle.createInput}
                        />
                        <div style={{
                            ...ChannelSidebarStyle.characterCount,
                            ...(newChannelName.length > 40 && ChannelSidebarStyle.characterCountWarning)
                        }}>
                            {newChannelName.length}/{MAX_CHANNEL_NAME_LENGTH}
                        </div>
                    </div>
                    <div style={ChannelSidebarStyle.createButtons}>
                        <button
                            onClick={handleCreateChannel}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                            style={ChannelSidebarStyle.createButton}
                        >
                            Create
                        </button>
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setNewChannelName("");
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            style={ChannelSidebarStyle.cancelButton}
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
