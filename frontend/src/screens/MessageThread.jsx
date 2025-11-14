import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import MessageThreadStyle from "../styles/MessageThreadStyle";
import api from "../api";
import { useUser } from "../context/UserContext";
import socketManager from "../utils/socketManager";

const MessageThread = () => {
  const { conversationId } = useParams(); // This is the projectId
  const { user } = useUser();
  const currentUserId = user?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize socket connection once
  useEffect(() => {
    console.log('[MessageThread] Setting up for conversation:', conversationId);
    
    // Ensure socket is connected
    socketManager.connect();
    
    // Join the room
    socketManager.joinRoom(conversationId);

    const handleReceiveMessage = (msg) => {
      console.log('[MessageThread] Received message via socket:', msg);
      console.log('[MessageThread] Current conversation:', conversationId);
      console.log('[MessageThread] Message conversation:', msg.conversationId);
      
      // Only process messages for this conversation
      if (msg.conversationId !== conversationId) {
        console.log('[MessageThread] Message is for different conversation, ignoring');
        return;
      }
      
      setMessages((prev) => {
        // Remove any temporary message with the same content (optimistic update)
        const filtered = prev.filter(m => {
          const mId = m._id || m.id;
          if (!mId) return true;
          const mIdStr = mId ? mId.toString() : '';
          return !mIdStr.startsWith('temp-') || m.content !== msg.content;
        });
        
        // Prevent duplicates of real messages
        const msgId = msg._id || msg.id;
        if (filtered.some(m => (m._id || m.id) === msgId)) {
          console.log('[MessageThread] Duplicate message, skipping:', msgId);
          return filtered;
        }
        
        console.log('[MessageThread] Adding new message to state:', msgId);
        return [...filtered, msg];
      });
    };

    socketManager.on("receiveMessage", handleReceiveMessage);

    return () => {
      console.log('[MessageThread] Cleaning up socket listeners');
      socketManager.off("receiveMessage", handleReceiveMessage);
    };
  }, [conversationId]);

  // Fetch project info and members
  useEffect(() => {
    const fetchProject = async () => {
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

  // Fetch message history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUserId) {
        console.log('Cannot fetch history - no currentUserId');
        return;
      }

      try {
        const res = await api.get(`/api/chat`, {
          params: { conversationId }
        });
        
        const sortedMessages = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        setMessages(sortedMessages);

        // Mark unread messages as read
        const unreadMessages = sortedMessages.filter(msg => {
          const msgId = msg._id || msg.id;
          const isUnread = !msg.readBy?.some(r => r.user?.toString() === currentUserId);
          const senderId = msg.sender?._id || msg.sender;
          const notMine = senderId !== currentUserId && senderId?.toString() !== currentUserId?.toString();
          console.log('Message:', msgId, 'Unread?', isUnread, 'Not mine?', notMine);
          return isUnread && notMine;
        });

        console.log('Found', unreadMessages.length, 'unread messages to mark as read');
        console.log('Current user ID:', currentUserId);

        if (unreadMessages.length > 0) {
          // Mark them as read one by one and wait for all to complete
          for (const msg of unreadMessages) {
            const msgId = msg._id || msg.id;
            if (!msgId) {
              console.error('Message has no ID:', msg);
              continue;
            }
            
            try {
              console.log('Marking message as read:', msgId, 'User:', currentUserId);
              await api.post(`/api/chat/${msgId}/read`, { userId: currentUserId });
              console.log('Successfully marked message as read:', msgId);
            } catch (err) {
              console.error('Error marking message as read:', msgId, err.response?.data || err);
            }
          }
          
          // Emit event to notify that messages were read (for real-time updates)
          if (socketManager.isConnected()) {
            socketManager.emit("messagesRead", { 
              conversationId, 
              userId: currentUserId,
              count: unreadMessages.length 
            });
          }
        }

      } catch (err) {
        console.error("Error loading message history:", err);
      }
    };

    fetchHistory();
  }, [conversationId, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Check character limit
    if (input.trim().length > 1000) {
      alert("Message is too long! Maximum 1000 characters.");
      return;
    }

    // Check if socket is connected
    if (!socketManager.isConnected()) {
      console.error("Socket not connected");
      alert("Connection lost. Please refresh the page.");
      return;
    }

    const msg = {
      conversationId, // projectId
      sender: currentUserId,
      content: input.trim(),
      recipients: members.map(m => m._id).filter(id => id !== currentUserId)
    };

    // Optimistically add message to UI immediately
    const optimisticMessage = {
      _id: `temp-${Date.now()}`, // Temporary ID
      id: `temp-${Date.now()}`, // Also set id for consistency
      ...msg,
      sender: {
        _id: currentUserId,
        firstName: user.firstName,
        lastName: user.lastName
      },
      createdAt: new Date().toISOString(),
      readBy: [] // Initialize as empty array
    };

    console.log('Adding optimistic message:', optimisticMessage);
    setMessages(prev => [...prev, optimisticMessage]);
    setInput("");
    
    // Send via socket
    socketManager.emit("sendMessage", msg);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <MainLayout showSidebar={true}>
      <div style={MessageThreadStyle.header}>
            {project && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={MessageThreadStyle.chatTitle}>
                  {project.name}
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

                  {/* Dropdown showing all members */}
                  {showAllMembers && members.length > 3 && (
                    <>
                      {/* Backdrop to close when clicking outside */}
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
                      
                      {/* Member list popup */}
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
          </div>

          <div style={MessageThreadStyle.chatWindow}>
            {messages.length === 0 ? (
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
                // Get message ID (handle both _id and id)
                const msgId = msg._id || msg.id;
                
                // Check if current user - handle both populated and unpopulated sender
                // Compare both _id (if populated) and the raw string (if not)
                const senderId = msg.sender?._id || msg.sender;
                const isCurrentUser = senderId === currentUserId || 
                                     senderId?.toString() === currentUserId?.toString();
                
                const senderName = isCurrentUser 
                  ? 'You'
                  : (msg.sender?.firstName 
                      ? `${msg.sender.firstName} ${msg.sender.lastName}`
                      : 'Unknown User');

                console.log('Message sender:', senderId, 'Current user:', currentUserId, 'Is current?', isCurrentUser);

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
                  // Auto-expand textarea
                  e.target.style.height = '40px';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${project?.name || 'project'}...`}
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
    </MainLayout>
  );
};

export default MessageThread;