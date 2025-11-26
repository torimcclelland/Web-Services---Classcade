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
            const newChannelId = res.data.id || res.data._id;
            onChannelSelect(newChannelId);
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

            const updated = channels.map(c => {
                const cId = c.id || c._id;
                return cId === channelId ? { ...c, name: newName.trim() } : c;
            });
            onChannelsUpdate(updated);
            setEditingChannelId(null);
        } catch (err) {
            console.error("Error updating channel:", err);
            alert("Failed to update channel");
        }
    };

    const handleDeleteChannel = async (channelId) => {
        console.log('[ChannelSidebar] handleDeleteChannel called with ID:', channelId);

        const channel = channels.find(c => (c.id || c._id) === channelId);
        const channelName = channel?.name;

        console.log('[ChannelSidebar] Found channel:', channel);
        console.log('[ChannelSidebar] Channel name:', channelName);

        if (channelName?.toLowerCase() === 'general') {
            console.log('[ChannelSidebar] Cannot delete general channel');
            alert("Cannot delete the general channel!");
            return;
        }

        if (!window.confirm(`Delete #${channelName}? All messages will be permanently lost.`)) {
            console.log('[ChannelSidebar] User cancelled delete');
            return;
        }

        try {
            console.log('[ChannelSidebar] Sending DELETE request to:', `/api/channels/${channelId}`);
            const response = await api.delete(`/api/channels/${channelId}`);
            console.log('[ChannelSidebar] Delete response:', response.data);

            const filtered = channels.filter(c => (c.id || c._id) !== channelId);
            console.log('[ChannelSidebar] Channels after filter:', filtered);
            onChannelsUpdate(filtered);

            if (activeChannelId === channelId) {
                console.log('[ChannelSidebar] Deleted channel was active, switching channel');
                const generalChannel = filtered.find(c => c.name.toLowerCase() === 'general');
                if (generalChannel) {
                    onChannelSelect(generalChannel.id || generalChannel._id);
                } else if (filtered.length > 0) {
                    onChannelSelect(filtered[0].id || filtered[0]._id);
                }
            }

            setOpenMenuId(null);
        } catch (err) {
            console.error('[ChannelSidebar] Error deleting channel:', err);
            console.error('[ChannelSidebar] Error response:', err.response?.data);
            alert("Failed to delete channel: " + (err.response?.data?.error || err.message));
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
                    const channelId = channel.id || channel._id;
                    const isActive = activeChannelId === channelId;
                    const isHovered = hoveredChannelId === channelId;
                    const isEditing = editingChannelId === channelId;
                    const isGeneral = channel.name?.toLowerCase() === 'general';

                    const itemStyle = {
                        ...ChannelSidebarStyle.channelItem,
                        ...(isCollapsed ? ChannelSidebarStyle.channelItemCollapsed : ChannelSidebarStyle.channelItemExpanded),
                        ...(isActive && ChannelSidebarStyle.channelItemActive),
                        ...(isHovered && !isActive && ChannelSidebarStyle.channelItemHover),
                    };

                    return (
                        <div
                            key={channelId}
                            style={itemStyle}
                            onMouseEnter={() => setHoveredChannelId(channelId)}
                            onMouseLeave={() => setHoveredChannelId(null)}
                        >
                            {isEditing && !isCollapsed ? (
                                <input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => handleUpdateChannel(channelId, editingName)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUpdateChannel(channelId, editingName);
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
                                        onClick={() => onChannelSelect(channelId)}
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
                                                    console.log('[ChannelSidebar] Menu button clicked for channel:', channelId);
                                                    setOpenMenuId(openMenuId === channelId ? null : channelId);
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                style={{
                                                    ...ChannelSidebarStyle.menuButton,
                                                    ...((isHovered || openMenuId === channelId) && ChannelSidebarStyle.menuButtonVisible)
                                                }}
                                            >
                                                ...
                                            </button>

                                            {openMenuId === channelId && (
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
                                                                console.log('[ChannelSidebar] Rename clicked for channel:', channelId);
                                                                setEditingChannelId(channelId);
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
                                                                console.log('[ChannelSidebar] Delete button clicked for channel:', channelId);
                                                                handleDeleteChannel(channelId);
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
