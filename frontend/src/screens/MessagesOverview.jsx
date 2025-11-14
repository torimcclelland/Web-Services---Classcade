import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import MainLayout from "../components/MainLayout";
import MessagesOverviewStyle from "../styles/MessagesOverviewStyle";
import api from "../api";
import { useUser } from "../context/UserContext";

let socket = null;

const MessagesOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const currentUserId = user?._id;
  const [projects, setProjects] = useState([]);
  const [projectMessages, setProjectMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({}); // Track unread count per project

  const fetchUserProjects = async () => {
    try {
      // Get all projects where user is a member
      const projectRes = await api.get("/api/project");
      const userProjects = projectRes.data.filter(project => 
        project.members.some(memberId => memberId === currentUserId)
      );
      
      setProjects(userProjects);

      // For each project, get the latest message AND unread count
      const messagesMap = {};
      const unreadMap = {};
      
      await Promise.all(
        userProjects.map(async (project) => {
          try {
            // Get latest message
            const msgRes = await api.get("/api/chat", {
              params: { 
                conversationId: project._id,
                limit: 1
              }
            });
            if (msgRes.data && msgRes.data.length > 0) {
              messagesMap[project._id] = msgRes.data[0];
            }

            // Get ALL messages to count unread
            const allMsgsRes = await api.get("/api/chat", {
              params: { 
                conversationId: project._id
              }
            });
            
            // Count unread messages (not sent by current user and not read by current user)
            const unreadCount = allMsgsRes.data.filter(msg => {
              const msgId = msg._id || msg.id;
              const senderId = msg.sender?._id || msg.sender;
              return senderId !== currentUserId && 
                     !msg.readBy?.some(r => r.user?.toString() === currentUserId);
            }).length;
            
            unreadMap[project._id] = unreadCount;
            
          } catch (err) {
            console.error(`Error fetching messages for project ${project._id}:`, err);
          }
        })
      );
      
      setProjectMessages(messagesMap);
      setUnreadCounts(unreadMap);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchUserProjects();
    }
  }, [currentUserId, location]); // Re-fetch whenever location changes (navigating back)

  // Listen for new messages in real-time
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:4000");
    }

    const handleNewMessage = (msg) => {
      // Update the latest message for this project
      setProjectMessages(prev => ({
        ...prev,
        [msg.conversationId]: msg
      }));

      // Increment unread count if the message is from someone else
      if (msg.sender?._id !== currentUserId) {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.conversationId]: (prev[msg.conversationId] || 0) + 1
        }));
      }
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [currentUserId]);

  const handleClick = (projectId) => {
    // Clear unread count when clicking into the chat
    setUnreadCounts(prev => ({
      ...prev,
      [projectId]: 0
    }));
    
    navigate(`/messages/${projectId}`);
  };

  // Sort projects by most recent message
  const sortedProjects = [...projects].sort((a, b) => {
    const msgA = projectMessages[a._id];
    const msgB = projectMessages[b._id];
    if (!msgA && !msgB) return 0;
    if (!msgA) return 1;
    if (!msgB) return -1;
    return new Date(msgB.createdAt) - new Date(msgA.createdAt);
  });

  return (
    <MainLayout showSidebar={true}>
      <h2 style={MessagesOverviewStyle.header}>Project Messages</h2>
          <div style={MessagesOverviewStyle.chatList}>
            {sortedProjects.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No projects yet
              </div>
            ) : (
              sortedProjects.map((project) => {
                const latestMsg = projectMessages[project._id];
                const unreadCount = unreadCounts[project._id] || 0;
                const hasUnread = unreadCount > 0;

                return (
                  <div
                    key={project._id}
                    style={MessagesOverviewStyle.chatItem}
                    onClick={() => handleClick(project._id)}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      position: 'relative'
                    }}>
                      {project.name.charAt(0).toUpperCase()}
                      {hasUnread && (
                        <div style={{
                          position: 'absolute',
                          top: '-2px',
                          right: '-2px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#dc3545',
                          border: '2px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                    </div>
                    <div style={MessagesOverviewStyle.chatText}>
                      <strong style={{ fontWeight: hasUnread ? 'bold' : 'normal' }}>
                        {project.name}
                      </strong>
                      {latestMsg ? (
                        <span style={{ 
                          color: '#666', 
                          fontSize: '0.9em',
                          fontWeight: hasUnread ? '600' : 'normal'
                        }}>
                          {latestMsg.sender?._id === currentUserId ? 'You: ' : 
                           `${latestMsg.sender?.firstName || 'Someone'}: `}
                          {latestMsg.content.slice(0, 40)}
                          {latestMsg.content.length > 40 ? '...' : ''}
                        </span>
                      ) : (
                        <span style={{ color: '#999', fontSize: '0.9em', fontStyle: 'italic' }}>
                          No messages yet
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
    </MainLayout>
  );
};

export default MessagesOverview;