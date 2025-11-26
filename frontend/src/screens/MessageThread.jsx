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
    const { conversationId } = useParams(); // This is the projectId
    const { user } = useUser();
    const currentUserId = user?._id;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [showAllMembers, setShowAllMembers] = useState(false);

    // Channel state
    const [channels, setChannels] = useState([]);
    const [activeChannelId, setActiveChannelId] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Responsive state
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const messagesEndRef = useRef(null);

    // Handle responsive layout
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch project info and members
    useEffect(() => {
        const fetchProject = async () => {
            if (!conversationId) return;

            try {
                const res = await api.get(`/api/project/${conversationId}`);
                setProject(res.data);

                // Fetch member details
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

    // Fetch channels for this project
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

    // Socket connection and message handling for active channel
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

    // Fetch messages for active channel
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

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle channel selection
    const handleChannelSelect = useCallback((channelId) => {
        if (channelId === activeChannelId) return;
        if (activeChannelId && socketManager.isConnected()) {
            socketManager.emit('leaveRoom', activeChannelId);
        }
        setActiveChannelId(channelId);
        setMessages([]);
        if (isMobile) {
            setIsSidebarCollapsed(true);
        }
    }, [activeChannelId, isMobile]);

    // Send message handler
    const sendMessage = useCallback(async () => {
        if (!input.trim() || !activeChannelId) return;
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
            recipients: members.map(m => m._id).filter(id => id !== currentUserId)
        };
        const optimisticMessage = {
            _id: `temp-${Date.now()}`,
            id: `temp-${Date.now()}`,
            ...msg,
            sender: {
                _id: currentUserId,
                firstName: user.firstName,
                lastName: user.lastName
            },
            createdAt: new Date().toISOString(),
            readBy: []
        };
        setMessages(prev => [...prev, optimisticMessage]);
        setInput("");
        socketManager.emit("sendMessage", msg);
    }, [input, activeChannelId, conversationId, currentUserId, members, user]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const activeChannel = channels.find(c => (c.id || c._id) === activeChannelId);

    // Date separator helper
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

    // Check if user is alone in project
    const isAloneInProject = members.length === 1 && members[0]._id === currentUserId;

    return (
        <MainLayout showSidebar={true}>
            <div style={MessageThreadStyle.container}>
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
                        {/* Header */}
                        <div style={{
                            ...MessageThreadStyle.header,
                            ...(isMobile && { padding: "0.75rem 1rem", minHeight: '60px', height: 'auto' })
                        }}>
                            {/* ASCII Mobile menu toggle */}
                            {isMobile && (
                                <button
                                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                    style={{
                                        background: 'none',
                                        border: '1px solid #1e3a8a',
                                        borderRadius: '5px',
                                        fontWeight: 700,
                                        fontSize: '0.9375rem',
                                        cursor: 'pointer',
                                        padding: '0.5rem 0.75rem',
                                        color: '#1e3a8a',
                                        marginRight: '0.5rem'
                                    }}
                                >
                                    MENU
                                </button>
                            )}
                            {project && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <h3 style={{
                                            ...MessageThreadStyle.chatTitle,
                                            ...(isMobile && { fontSize: '1rem' })
                                        }}>
                                            {project.name}
                                        </h3>
                                        {activeChannel && (
                                            <span style={MessageThreadStyle.channelBadge}>
                                                #{activeChannel.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Messages window */}
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
                                groupMessagesByDate(messages).map((item, index) => {
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
                                                    {senderName}
                                                </strong>
                                                <span style={MessageThreadStyle.messageContent}>
                                                    {msg.content}
                                                </span>
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

                        {/* Input area */}
                        {activeChannelId && !isAloneInProject && (
                            <div style={{
                                ...MessageThreadStyle.inputArea,
                                ...(isMobile && { padding: '0.75rem 1rem' })
                            }}>
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
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                                >
                                    Send
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
};

export default MessageThread;
