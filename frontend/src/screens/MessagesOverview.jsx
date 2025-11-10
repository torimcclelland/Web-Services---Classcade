import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import ProfileCircle from "../components/ProfileCircle";
import MessagesOverviewStyle from "../styles/MessagesOverviewStyle";
import api from "../api";
import { useUser } from "../context/UserContext";

let socket = null;

const MessagesOverview = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const currentUserId = user?._id;
  const [projects, setProjects] = useState([]);
  const [projectMessages, setProjectMessages] = useState({});

  const fetchUserProjects = async () => {
    try {
      // Get all projects where user is a member
      const projectRes = await api.get("/api/project");
      const userProjects = projectRes.data.filter(project => 
        project.members.some(memberId => memberId === currentUserId)
      );
      
      setProjects(userProjects);

      // For each project, get the latest message
      const messagesMap = {};
      await Promise.all(
        userProjects.map(async (project) => {
          try {
            const msgRes = await api.get("/api/chat", {
              params: { 
                conversationId: project._id,
                limit: 1
              }
            });
            if (msgRes.data && msgRes.data.length > 0) {
              messagesMap[project._id] = msgRes.data[0];
            }
          } catch (err) {
            console.error(`Error fetching messages for project ${project._id}:`, err);
          }
        })
      );
      
      setProjectMessages(messagesMap);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchUserProjects();
    }
  }, [currentUserId]);

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
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, []);

  const handleClick = (projectId) => {
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
    <div style={MessagesOverviewStyle.container}>
      <TopNavBar />
      <div style={MessagesOverviewStyle.layout}>
        <SideBar />
        <main style={MessagesOverviewStyle.main}>
          <h2 style={MessagesOverviewStyle.header}>Project Messages</h2>
          <div style={MessagesOverviewStyle.chatList}>
            {sortedProjects.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No projects yet
              </div>
            ) : (
              sortedProjects.map((project) => {
                const latestMsg = projectMessages[project._id];
                const hasUnread = latestMsg && 
                  !latestMsg.readBy?.some(r => r.user?.toString() === currentUserId) &&
                  latestMsg.sender?._id !== currentUserId;

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
                      fontSize: '18px'
                    }}>
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={MessagesOverviewStyle.chatText}>
                      <strong>{project.name}</strong>
                      {latestMsg ? (
                        <span style={{ color: '#666', fontSize: '0.9em' }}>
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
                    {hasUnread && (
                      <div style={MessagesOverviewStyle.unreadDot} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagesOverview;