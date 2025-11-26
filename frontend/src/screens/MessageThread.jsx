import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ChannelSidebar from "../components/ChannelSidebar";
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

    const messagesEndRef = useRef(null);

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
                console.log('Fetched channels:', res.data);

                if (res.data.length === 0) {
                    // Create default general channel if none exist
                    console.log('No channels found, creating general channel');
                    const generalRes = await api.post(`/api/project/${conversationId}/channels`, {
                        name: 'general',
                        description: 'General discussion'
                    });
                    setChannels([generalRes.data]);
                    setActiveChannelId(generalRes.data._id);
                } else {
                    setChannels(res.data);
                    // Set first channel (preferably general) as active
                    const generalChannel = res.data.find(c => c.name.toLowerCase() === 'general');
                    setActiveChannelId(generalChannel?._id || res.data[0]._id);
                }
            } catch (err) {
                console.error("Error fetching channels:", err);
            }
        };

        fetchChannels();
    }, [conversationId]);

    // Socket connection and message handling for active channel
    useEffect(() => {
        if (!activeChannelId) return;

        console.log('[MessageThread] Setting up socket for channel:', activeChannelId);

        socketManager.connect();
        socketManager.joinRoom(activeChannelId);

        const handleReceiveMessage = (msg) => {
            console.log('[MessageThread] Received message:', msg);

            // Only process messages for active channel
            if (msg.channelId !== activeChannelId) {
                console.log('[MessageThread] Message for different channel, ignoring');
                return;
            }

            setMessages((prev) => {
                // Remove temporary optimistic message
                const filtered = prev.filter(m => {
                    const mId = m._id || m.id;
                    if (!mId) return true;
                    const mIdStr = mId.toString();
                    return !mIdStr.startsWith('temp-') || m.content !== msg.content;
                });

                // Prevent duplicate real messages
                const msgId = msg._id || msg.id;
                if (filtered.some(m => (m._id || m.id) === msgId)) {
                    console.log('[MessageThread] Duplicate message, skipping:', msgId);
                    return filtered;
                }

                console.log('[MessageThread] Adding new message:', msgId);
                return [...filtered, msg];
            });
        };

        socketManager.on("receiveMessage", handleReceiveMessage);

        return () => {
            console.log('[MessageThread] Cleaning up socket listeners');
            socketManager.off("receiveMessage", handleReceiveMessage);
            socketManager.leaveRoom(activeChannelId);
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

                // Mark unread messages as read
                const unreadMessages = sortedMessages.filter(msg => {
                    const isUnread = !msg.readBy?.some(r => r.user?.toString() === currentUserId);
                    const senderId = msg.sender?._id || msg.sender;
                    const notMine = senderId !== currentUserId && senderId?.toString() !== currentUserId?.toString();
                    return isUnread && notMine;
                });

                console.log('Found', unreadMessages.length, 'unread messages');

                if (unreadMessages.length > 0) {
                    for (const msg of unreadMessages) {
                        const msgId = msg._id || msg.id;
                        if (!msgId) continue;

                        try {
                            await api.post(`/api/chat/${msgId}/read`, { userId: currentUserId });
                        } catch (err) {
                            console.error('Error marking message as read:', msgId, err);
                        }
                    }

                    if (socketManager.isConnected()) {
                        socketManager.emit("messagesRead", {
                            channelId: activeChannelId,
                            userId: currentUserId,
                            count: unreadMessages.length
                        });
                    }
                }

            } catch (err) {
                console.error("Error loading messages:", err);
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
        setActiveChannelId(channelId);
        setMessages([]); // Clear messages when switching channels
    }, []);

    // Send message handler
    const sendMessage = useCallback(async () => {
        if (!input.trim() || !activeChannelId) return;

        if (input.trim().length > 1000) {
            alert("Message is too long! Maximum 1000 characters.");
            return;
        }

        if (!socketManager.isConnected()) {
            console.error("Socket not connected");
            alert("Connection lost. Please refresh the page.");
            return;
        }

        const msg = {
            channelId: activeChannelId,
            conversationId: conversationId, // Keep for backwards compatibility
            sender: currentUserId,
            content: input.trim(),
            recipients: members.map(m => m._id).filter(id => id !== currentUserId)
        };

        // Optimistic UI update
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

    const activeChannel = channels.find(c => c._id === activeChannelId);

    return (
        <MainLayout showSidebar={true}>
            <div style={MessageThreadStyle.container}>
                <div style={MessageThreadStyle.layout}>
                    {/* Channel Sidebar */}
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
                        <div style={MessageThreadStyle.header}>
                            {project && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={MessageThreadStyle.chatTitle}>
                                        {project.name} {activeChannel && `/ #${activeChannel.name}`}
                                    </h3>
                                    <div style={{
                                        fontSize: '0.85em',
                                        color: '#666',
                                        marginTop: '4px',
                                        position: 'relative'
                                    }}>
                                        <span>
                                            {members.length} member{members.length !== 1 ? 's' : ''}
                                            {members.length > 0 && ': '}
                                            {members.slice(0, 3).map(m => m.firstName).join(', ')}
                                            {members.length > 3 && (
                                                <span
                                                    onClick={() => setShowAllMembers(!showAllMembers)}
                                                    style={{
                                                        color: '#007bff',
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline',
                                                        marginLeft: '2px'
                                                    }}
                                                >
                                                    +{members.length - 3} more
                                                </span>
                                            )}
                                        </span>

                                        {/* Members dropdown */}
                                        {showAllMembers && members.length > 3 && (
                                            <>
                                                <div
                                                    onClick={() => setShowAllMembers(false)}
                                                    style={{
                                                        position: 'fixed',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        zIndex: 999
                                                    }}
                                                />

                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    marginTop: '8px',
                                                    backgroundColor: 'white',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                    padding: '12px',
                                                    minWidth: '200px',
                                                    maxWidth: '300px',
                                                    zIndex: 1000,
                                                }}>
                                                    <div style={{
                                                        fontWeight: '600',
                                                        marginBottom: '8px',
                                                        color: '#333',
                                                        fontSize: '0.9em'
                                                    }}>
                                                        All Members ({members.length})
                                                    </div>
                                                    {members.map((member, index) => (
                                                        <div
                                                            key={member._id}
                                                            style={{
                                                                padding: '6px 0',
                                                                color: '#555',
                                                                fontSize: '0.95em',
                                                                borderTop: index > 0 ? '1px solid #f0f0f0' : 'none'
                                                            }}
                                                        >
                                                            {member.firstName} {member.lastName}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div style={{ flexShrink: 0 }}>
                            </div>
                        </div>

                        {/* Messages window */}
                        <div style={MessageThreadStyle.chatWindow}>
                            {!activeChannelId ? (
                                <div style={{
                                    textAlign: 'center',
                                    color: '#999',
                                    padding: '40px',
                                    fontStyle: 'italic'
                                }}>
                                    Select a channel to start messaging
                                </div>
                            ) : messages.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    color: '#999',
                                    padding: '40px',
                                    fontStyle: 'italic'
                                }}>
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                messages.map((msg) => {
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
                                                    backgroundColor: isCurrentUser ? '#007bff' : '#e9ecef',
                                                    color: isCurrentUser ? 'white' : 'black',
                                                    maxWidth: '70%',
                                                    padding: '10px 14px',
                                                    borderRadius: '16px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '4px'
                                                }}
                                            >
                                                <strong style={{
                                                    fontSize: '0.85em',
                                                    fontWeight: '600'
                                                }}>
                                                    {senderName}
                                                </strong>

                                                <span style={{
                                                    wordBreak: 'break-word',
                                                    fontSize: '0.95em',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {msg.content}
                                                </span>

                                                <small style={{
                                                    fontSize: '0.7em',
                                                    opacity: 0.7,
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
                        {activeChannelId && (
                            <div style={MessageThreadStyle.inputArea}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <textarea
                                        style={{
                                            ...MessageThreadStyle.input,
                                            resize: 'none',
                                            minHeight: '40px',
                                            maxHeight: '120px',
                                            overflowY: 'auto',
                                            fontFamily: 'inherit',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
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
                                        position: 'absolute',
                                        bottom: '12px',
                                        right: '12px',
                                        fontSize: '11px',
                                        color: input.length > 900 ? '#dc3545' : '#999',
                                        pointerEvents: 'none',
                                    }}>
                                        {input.length}/1000
                                    </div>
                                </div>
                                <button
                                    style={MessageThreadStyle.sendButton}
                                    onClick={sendMessage}
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
