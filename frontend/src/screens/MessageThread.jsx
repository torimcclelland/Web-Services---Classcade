import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ChannelSidebar from "../components/ChannelSidebar";
import EmptyProjectState from "../components/EmptyProjectState";
import MessageThreadStyle from "../styles/MessageThreadStyle";
import api from "../api";
import { useUser } from "../context/UserContext";
import socketManager from "../utils/socketManager";
import MainLayout from '../components/MainLayout';

const MessageThread = () => {
    const { conversationId } = useParams();
    const { user } = useUser();
    const currentUserId = user?._id;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [showAllMembers, setShowAllMembers] = useState(false);

    const [channels, setChannels] = useState([]);
    const [activeChannelId, setActiveChannelId] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const MAX_ATTACHMENTS = 5;

    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            if (!conversationId) return;

            try {
                const res = await api.get(`/api/project/${conversationId}`);
                setProject(res.data);

                const memberPromises = res.data.members.map(memberId =>
                    api.get(`/api/user/${memberId}`)
                );
                const memberResults = await Promise.all(memberPromises);
                setMembers(memberResults.map(r => r.data));
            } catch (err) {
                console.error("Error fetching project:", err);
            }
        };

        fetchProject();
    }, [conversationId]);

    useEffect(() => {
        const fetchChannels = async () => {
            if (!conversationId) return;

            try {
                const res = await api.get(`/api/project/${conversationId}/channels`);
                if (res.data.length === 0) {
                    const generalRes = await api.post(`/api/project/${conversationId}/channels`, {
                        name: 'general',
                        description: 'General discussion'
                    });
                    setChannels([generalRes.data]);
                    const channelId = generalRes.data.id || generalRes.data._id;
                    setActiveChannelId(channelId);
                } else {
                    setChannels(res.data);
                    const generalChannel = res.data.find(c => c.name && c.name.toLowerCase() === 'general');
                    const firstChannel = generalChannel || res.data[0];
                    const initialChannelId = firstChannel?.id || firstChannel?._id;
                    if (initialChannelId) {
                        setActiveChannelId(initialChannelId);
                    }
                }
            } catch (err) {
                console.error("[MessageThread] Error fetching channels:", err);
            }
        };

        fetchChannels();
    }, [conversationId]);

    useEffect(() => {
        if (!activeChannelId) return;

        socketManager.connect();
        socketManager.joinRoom(activeChannelId);

        const handleReceiveMessage = (msg) => {
            if (msg.channelId !== activeChannelId) return;
            setMessages((prev) => {
                const filtered = prev.filter(m => {
                    const mId = m._id || m.id;
                    if (!mId) return true;
                    const mIdStr = mId.toString();
                    return !mIdStr.startsWith('temp-') || m.content !== msg.content;
                });

                const msgId = msg._id || msg.id;
                if (filtered.some(m => (m._id || m.id) === msgId)) return filtered;
                return [...filtered, msg];
            });
        };

        socketManager.on("receiveMessage", handleReceiveMessage);

        return () => {
            socketManager.off("receiveMessage", handleReceiveMessage);
            if (socketManager.isConnected()) {
                socketManager.emit('leaveRoom', activeChannelId);
            }
        };
    }, [activeChannelId]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!currentUserId || !activeChannelId) return;
            try {
                const res = await api.get(`/api/channels/${activeChannelId}/messages`);
                const sortedMessages = res.data.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                setMessages(sortedMessages);
            } catch (err) {
                console.error("[MessageThread] Error loading messages:", err);
            }
        };
        fetchHistory();
    }, [activeChannelId, currentUserId]);

    useEffect(() => {
        if (!activeChannelId || !currentUserId || messages.length === 0) return;

        const timer = setTimeout(() => {
            socketManager.emit('markChannelAsRead', {
                channelId: activeChannelId,
                userId: currentUserId
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [activeChannelId, currentUserId, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleChannelSelect = useCallback((channelId) => {
        if (channelId === activeChannelId) return;
        if (activeChannelId && socketManager.isConnected()) {
            socketManager.emit('leaveRoom', activeChannelId);
        }
        setActiveChannelId(channelId);
        setMessages([]);
        setAttachments([]);
        setSearchQuery("");
        setShowSearch(false);
        if (isMobile) {
            setIsSidebarCollapsed(true);
        }
    }, [activeChannelId, isMobile]);

    const filterMessagesBySearch = (messageGroups) => {
        if (!searchQuery.trim()) return messageGroups;

        const query = searchQuery.toLowerCase();
        return messageGroups.filter(item => {
            if (item.type === 'date') return true;
            const msg = item.data;
            const contentMatch = msg.content?.toLowerCase().includes(query);
            const senderMatch = msg.sender?.firstName?.toLowerCase().includes(query) ||
                msg.sender?.lastName?.toLowerCase().includes(query);
            const fileMatch = msg.attachments?.some(att =>
                att.originalName?.toLowerCase().includes(query)
            );
            return contentMatch || senderMatch || fileMatch;
        });
    };

    const highlightText = (text, query) => {
        if (!query.trim() || !text) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ?
                <mark key={i} style={{ backgroundColor: '#fef08a', padding: '2px 0' }}>{part}</mark> :
                part
        );
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (attachments.length + files.length > MAX_ATTACHMENTS) {
            alert(`You can only attach up to ${MAX_ATTACHMENTS} files per message. Currently selected: ${attachments.length}`);
            e.target.value = '';
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        const oversized = files.filter(f => f.size > maxSize);
        if (oversized.length > 0) {
            alert('Some files are too large. Maximum size is 10MB per file.');
            e.target.value = '';
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));

            const response = await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAttachments(prev => [...prev, ...response.data.files]);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload files');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const sendMessage = useCallback(async () => {
        if (!input.trim() && attachments.length === 0) return;
        if (!activeChannelId) return;
        if (!user || !currentUserId) {
            console.error('Cannot send message: user not logged in');
            return;
        }

        if (input.trim().length > 1000) {
            alert("Message is too long! Maximum 1000 characters.");
            return;
        }
        if (!socketManager.isConnected()) {
            alert("Connection lost. Please refresh the page.");
            return;
        }

        const msg = {
            channelId: activeChannelId,
            conversationId: conversationId,
            sender: currentUserId,
            content: input.trim(),
            attachments: attachments,
            recipients: members.map(m => m._id).filter(id => id !== currentUserId)
        };

        const optimisticMessage = {
            _id: `temp-${Date.now()}`,
            id: `temp-${Date.now()}`,
            ...msg,
            sender: {
                _id: currentUserId,
                firstName: user?.firstName || '',
                lastName: user?.lastName || ''
            },
            createdAt: new Date().toISOString(),
            readBy: []
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setInput("");
        setAttachments([]);
        socketManager.emit("sendMessage", msg);
    }, [input, attachments, activeChannelId, conversationId, currentUserId, members, user]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const activeChannel = channels.find(c => (c.id || c._id) === activeChannelId);

    const formatDateSeparator = (date) => {
        const today = new Date();
        const messageDate = new Date(date);
        const isToday = today.toDateString() === messageDate.toDateString();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = yesterday.toDateString() === messageDate.toDateString();
        if (isToday) return 'Today';
        if (isYesterday) return 'Yesterday';
        return messageDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    };

    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentDate = null;
        messages.forEach(msg => {
            const msgDate = new Date(msg.createdAt).toDateString();
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                groups.push({
                    type: 'date',
                    date: msg.createdAt
                });
            }
            groups.push({
                type: 'message',
                data: msg
            });
        });
        return groups;
    };

    const isAloneInProject = members.length === 1 && members[0]._id === currentUserId;

    return (
        <MainLayout showSidebar={true}>
            <div style={{
                ...MessageThreadStyle.container,
                height: 'calc(100vh - 120px)',  // Increased from 100px to 120px
                maxHeight: 'calc(100vh - 120px)',
                width: '100%',
                maxWidth: '100%',
            }}>
                <div style={MessageThreadStyle.layout}>
                    <ChannelSidebar
                        channels={channels}
                        activeChannelId={activeChannelId}
                        onChannelSelect={handleChannelSelect}
                        projectId={conversationId}
                        onChannelsUpdate={setChannels}
                        isCollapsed={isSidebarCollapsed}
                        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    />

                    <main style={MessageThreadStyle.main}>
                        <div style={{
                            ...MessageThreadStyle.header,
                            ...(isMobile && { padding: "1rem 1rem", minHeight: '60px', height: 'auto' }),
                            flexDirection: 'column',
                            gap: showSearch ? '0.75rem' : '0',
                            alignItems: 'stretch',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                gap: '0.75rem',
                                minHeight: '40px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    flex: 1,
                                    minWidth: 0,
                                    overflow: 'hidden'
                                }}>
                                    {isMobile && (
                                        <button
                                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                            style={{
                                                background: 'none',
                                                border: '1px solid #1e3a8a',
                                                borderRadius: '5px',
                                                fontWeight: 700,
                                                fontSize: '0.875rem',
                                                cursor: 'pointer',
                                                padding: '0.5rem 0.75rem',
                                                color: '#1e3a8a',
                                                flexShrink: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            MENU
                                        </button>
                                    )}
                                    {project && (
                                        <div style={{
                                            flex: 1,
                                            minWidth: 0,
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                overflow: 'hidden'
                                            }}>
                                                <h3 style={{
                                                    ...MessageThreadStyle.chatTitle,
                                                    ...(isMobile && { fontSize: '1rem' }),
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 1
                                                }}>
                                                    {project.name}
                                                </h3>
                                                {activeChannel && (
                                                    <span style={{
                                                        ...MessageThreadStyle.channelBadge,
                                                        flexShrink: 0,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        maxWidth: isMobile ? '120px' : '200px'
                                                    }}>
                                                        #{activeChannel.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setShowSearch(!showSearch);
                                        if (showSearch) {
                                            setSearchQuery("");
                                        }
                                    }}
                                    style={{
                                        background: showSearch ? '#1e3a8a' : 'white',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        color: showSearch ? 'white' : '#1e3a8a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s',
                                        flexShrink: 0,
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!showSearch) {
                                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!showSearch) {
                                            e.currentTarget.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>
                                    {!isMobile && <span>Search</span>}
                                </button>
                            </div>

                            {showSearch && (
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxSizing: 'border-box'
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Search messages..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            minWidth: 0
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                    {searchQuery && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0
                                        }}>
                                            {filterMessagesBySearch(groupMessagesByDate(messages)).filter(i => i.type === 'message').length} results
                                        </span>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setShowSearch(false);
                                        }}
                                        style={{
                                            background: '#fee2e2',
                                            border: '1px solid #fecaca',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            color: '#dc2626',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{
                            ...MessageThreadStyle.chatWindow,
                            ...(isMobile && { padding: '1rem' })
                        }}>
                            {isAloneInProject ? (
                                <EmptyProjectState projectName={project?.name || 'this project'} />
                            ) : !activeChannelId ? (
                                <div style={MessageThreadStyle.emptyState}>
                                    Select a channel to start messaging
                                </div>
                            ) : messages.length === 0 ? (
                                <div style={MessageThreadStyle.emptyState}>
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                filterMessagesBySearch(groupMessagesByDate(messages)).map((item, index) => {
                                    if (item.type === 'date') {
                                        return (
                                            <div key={`date-${index}`} style={MessageThreadStyle.dateSeparator}>
                                                <div style={MessageThreadStyle.dateSeparatorLine}></div>
                                                <div style={MessageThreadStyle.dateSeparatorText}>
                                                    {formatDateSeparator(item.date)}
                                                </div>
                                                <div style={MessageThreadStyle.dateSeparatorLine}></div>
                                            </div>
                                        );
                                    }

                                    const msg = item.data;
                                    const msgId = msg._id || msg.id;
                                    const senderId = msg.sender?._id || msg.sender;
                                    const isCurrentUser = senderId === currentUserId ||
                                        senderId?.toString() === currentUserId?.toString();

                                    const senderName = isCurrentUser
                                        ? 'You'
                                        : (msg.sender?.firstName
                                            ? `${msg.sender.firstName} ${msg.sender.lastName}`
                                            : 'Unknown User');

                                    return (
                                        <div
                                            key={msgId}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                                marginBottom: '12px',
                                                width: '100%'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    ...MessageThreadStyle.messageBubble,
                                                    backgroundColor: isCurrentUser ? '#1e3a8a' : '#ffffff',
                                                    color: isCurrentUser ? 'white' : '#1f2937',
                                                    maxWidth: isMobile ? '85%' : '70%',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '4px',
                                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                                }}
                                            >
                                                <strong style={MessageThreadStyle.messageAuthor}>
                                                    {highlightText(senderName, searchQuery)}
                                                </strong>

                                                {msg.content && (
                                                    <span style={MessageThreadStyle.messageContent}>
                                                        {highlightText(msg.content, searchQuery)}
                                                    </span>
                                                )}

                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div style={{
                                                        marginTop: msg.content ? '8px' : '0',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '6px'
                                                    }}>
                                                        {msg.attachments.map((file, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={`http://localhost:4000${file.url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download={file.originalName}
                                                                style={{
                                                                    padding: '8px 12px',
                                                                    backgroundColor: isCurrentUser ? '#1e40af' : '#f3f4f6',
                                                                    color: isCurrentUser ? '#fff' : '#1e3a8a',
                                                                    borderRadius: '6px',
                                                                    textDecoration: 'none',
                                                                    fontSize: '0.875rem',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    transition: 'opacity 0.2s',
                                                                    border: isCurrentUser ? 'none' : '1px solid #e5e7eb'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                                            >
                                                                <span style={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    marginRight: '8px'
                                                                }}>
                                                                    {highlightText(file.originalName, searchQuery)}
                                                                </span>
                                                                <span style={{
                                                                    fontSize: '0.75rem',
                                                                    opacity: 0.8,
                                                                    flexShrink: 0
                                                                }}>
                                                                    {formatFileSize(file.fileSize)}
                                                                </span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}

                                                <small style={{
                                                    ...MessageThreadStyle.messageTime,
                                                    alignSelf: 'flex-end'
                                                }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </small>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {activeChannelId && !isAloneInProject && (
                            <div style={{
                                ...MessageThreadStyle.inputArea,
                                ...(isMobile && { padding: '0.75rem 1rem' }),
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                {attachments.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        padding: '10px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '8px',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '4px'
                                        }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Attachments ({attachments.length}/{MAX_ATTACHMENTS})
                                            </span>
                                            {attachments.length >= MAX_ATTACHMENTS && (
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: '#dc2626',
                                                    fontWeight: '500'
                                                }}>
                                                    Limit reached
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            flexWrap: 'wrap'
                                        }}>
                                            {attachments.map((file, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '8px 10px',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    border: '1px solid #e5e7eb',
                                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                                }}>
                                                    <span style={{
                                                        maxWidth: isMobile ? '150px' : '250px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        color: '#1f2937'
                                                    }}>
                                                        {file.originalName}
                                                    </span>
                                                    <span style={{
                                                        color: '#9ca3af',
                                                        fontSize: '0.75rem',
                                                        flexShrink: 0
                                                    }}>
                                                        {formatFileSize(file.fileSize)}
                                                    </span>
                                                    <button
                                                        onClick={() => removeAttachment(idx)}
                                                        style={{
                                                            background: '#fee2e2',
                                                            border: '1px solid #fecaca',
                                                            color: '#dc2626',
                                                            cursor: 'pointer',
                                                            fontSize: '1.125rem',
                                                            padding: '2px 7px',
                                                            borderRadius: '4px',
                                                            lineHeight: '1',
                                                            fontWeight: '700',
                                                            transition: 'all 0.2s',
                                                            flexShrink: 0,
                                                            fontFamily: 'Arial, sans-serif'
                                                        }}
                                                        title="Remove attachment"
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#fecaca';
                                                            e.currentTarget.style.transform = 'scale(1.1)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#fee2e2';
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                        }}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                    <button
                                        onClick={() => {
                                            if (attachments.length >= MAX_ATTACHMENTS) {
                                                alert(`Maximum ${MAX_ATTACHMENTS} attachments per message`);
                                                return;
                                            }
                                            fileInputRef.current?.click();
                                        }}
                                        disabled={uploading}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            padding: '0',
                                            backgroundColor: attachments.length >= MAX_ATTACHMENTS ? '#f3f4f6' : '#ffffff',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            cursor: (uploading || attachments.length >= MAX_ATTACHMENTS) ? 'not-allowed' : 'pointer',
                                            color: attachments.length >= MAX_ATTACHMENTS ? '#9ca3af' : '#1e3a8a',
                                            transition: 'all 0.2s',
                                            flexShrink: 0,
                                            opacity: attachments.length >= MAX_ATTACHMENTS ? 0.5 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title={
                                            attachments.length >= MAX_ATTACHMENTS
                                                ? `Maximum ${MAX_ATTACHMENTS} attachments reached`
                                                : 'Attach files'
                                        }
                                        onMouseEnter={(e) => {
                                            if (!uploading && attachments.length < MAX_ATTACHMENTS) {
                                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                                e.currentTarget.style.borderColor = '#1e3a8a';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (attachments.length < MAX_ATTACHMENTS) {
                                                e.currentTarget.style.backgroundColor = '#ffffff';
                                                e.currentTarget.style.borderColor = '#d1d5db';
                                            }
                                        }}
                                    >
                                        {uploading ? '...' : (
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                            >
                                                <path d="M11.5 1a3.5 3.5 0 0 0-3.5 3.5V11a2 2 0 0 0 4 0V5.5a.5.5 0 0 1 1 0V11a3 3 0 1 1-6 0V4.5a4.5 4.5 0 1 1 9 0V11a.5.5 0 0 1-1 0V4.5A3.5 3.5 0 0 0 11.5 1z" />
                                            </svg>
                                        )}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        multiple
                                        style={{ display: 'none' }}
                                        accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                                        disabled={attachments.length >= MAX_ATTACHMENTS}
                                    />

                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <textarea
                                            style={{
                                                ...MessageThreadStyle.input,
                                                resize: 'none',
                                                minHeight: '40px',
                                                maxHeight: '120px',
                                                overflowY: 'auto',
                                                padding: '10px',
                                                paddingRight: '60px',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                            }}
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                                e.target.style.height = '40px';
                                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                            }}
                                            onKeyPress={handleKeyPress}
                                            placeholder={`Message #${activeChannel?.name || 'channel'}...`}
                                            maxLength={1000}
                                            rows={1}
                                        />
                                        <div style={{
                                            ...MessageThreadStyle.characterCount,
                                            color: input.length > 900 ? '#dc3545' : '#999',
                                        }}>
                                            {input.length}/1000
                                        </div>
                                    </div>

                                    <button
                                        style={{
                                            ...MessageThreadStyle.sendButton,
                                            ...(isMobile && { padding: '0.75rem 1rem', fontSize: '0.8125rem' })
                                        }}
                                        onClick={sendMessage}
                                        disabled={uploading || (!input.trim() && attachments.length === 0)}
                                        onMouseEnter={(e) => !uploading && (e.currentTarget.style.backgroundColor = '#1e40af')}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
};

export default MessageThread;