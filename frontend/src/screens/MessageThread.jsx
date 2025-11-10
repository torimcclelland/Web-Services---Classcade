import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import MessageThreadStyle from "../styles/MessageThreadStyle";
import api from "../api";
import { useUser } from "../context/UserContext";

// Move socket outside component to prevent reconnections
let socket = null;

const MessageThread = () => {
  const { conversationId } = useParams(); // This is the projectId
  const navigate = useNavigate();
  const { user } = useUser();
  const currentUserId = user?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialize socket connection once
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:4000", {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });
      
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    // Make sure we're connected before joining
    if (socket.connected) {
      socket.emit("joinRoom", conversationId);
    } else {
      socket.on('connect', () => {
        socket.emit("joinRoom", conversationId);
      });
    }

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => {
        // Remove any temporary message with the same content (optimistic update)
        const filtered = prev.filter(m => {
          const mId = m._id ? m._id.toString() : '';
          return !mId.startsWith('temp-') || m.content !== msg.content;
        });
        
        // Prevent duplicates of real messages
        if (filtered.some(m => m._id === msg._id)) {
          return filtered;
        }
        
        return [...filtered, msg];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
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
      try {
        const res = await api.get(`/api/chat`, {
          params: { conversationId }
        });
        
        const sortedMessages = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        setMessages(sortedMessages);

        // Mark unread messages as read
        const unreadMessages = sortedMessages.filter(
          msg => !msg.readBy?.some(r => r.user?.toString() === currentUserId) &&
                 msg.sender?._id !== currentUserId
        );

        await Promise.all(
          unreadMessages.map((msg) =>
            api.post(`/api/chat/${msg._id}/read`, { userId: currentUserId })
          )
        );

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

    // Check if socket is connected
    if (!socket || !socket.connected) {
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
      ...msg,
      sender: {
        _id: currentUserId,
        firstName: user.firstName,
        lastName: user.lastName
      },
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setInput("");
    
    // Send via socket
    socket.emit("sendMessage", msg);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={MessageThreadStyle.container}>
      <TopNavBar />
      <div style={MessageThreadStyle.layout}>
        <SideBar />
        <main style={MessageThreadStyle.main}>
          <div style={MessageThreadStyle.header}>
            <button 
              style={MessageThreadStyle.backButton} 
              onClick={() => navigate('/messages')}
            >
              ← Back
            </button>
            {project && (
              <div style={{ flex: 1 }}>
                <h3 style={MessageThreadStyle.chatTitle}>
                  {project.name}
                </h3>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                  {members.length} member{members.length !== 1 ? 's' : ''}
                  {members.length > 0 && ': '}
                  {members.slice(0, 3).map(m => m.firstName).join(', ')}
                  {members.length > 3 && ` +${members.length - 3} more`}
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
                    key={msg._id} 
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
            <input
              style={MessageThreadStyle.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${project?.name || 'project'}...`}
            />
            <button 
              style={MessageThreadStyle.sendButton} 
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessageThread;