import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import ProfileCircle from "../components/ProfileCircle";
import MessagesOverviewStyle from "../styles/MessagesOverviewStyle";
import api from "../api";
import { useUser } from "../context/UserContext";

const MessagesOverview = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const currentUserId = user?._id;
  const [chats, setChats] = useState([]);

  const groupByConversation = (messages) => {
    const map = new Map();
    messages.forEach((msg) => {
      const existing = map.get(msg.conversationId);
      if (!existing || new Date(msg.createdAt) > new Date(existing.createdAt)) {
        map.set(msg.conversationId, msg);
      }
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/api/chat", {
          params: { userId: currentUserId }
        });
        const grouped = groupByConversation(res.data);
        setChats(grouped);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [currentUserId]);

  const handleClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div style={MessagesOverviewStyle.container}>
      <TopNavBar />
      <div style={MessagesOverviewStyle.layout}>
        <SideBar />
        <main style={MessagesOverviewStyle.main}>
          <h2 style={MessagesOverviewStyle.header}>Messages</h2>
          <div style={MessagesOverviewStyle.chatList}>
            {chats.map((chat) => {
              const senderName =
                chat.sender?.firstName && chat.sender?.lastName
                  ? `${chat.sender.firstName} ${chat.sender.lastName}`
                  : "Unknown User";

              const avatarUrl = chat.sender?.avatar || "https://via.placeholder.com/40";

              return (
                <div
                  key={chat._id}
                  style={MessagesOverviewStyle.chatItem}
                  onClick={() => handleClick(chat.conversationId)}
                >
                  <ProfileCircle avatarUrl={avatarUrl} name={senderName} size={40} />
                  <div style={MessagesOverviewStyle.chatText}>
                    <strong>{senderName}</strong>
                    <span>{chat.content.slice(0, 40)}...</span>
                  </div>
                  {!chat.readBy?.some(r => r.user?.toString() === currentUserId) && (
                    <div style={MessagesOverviewStyle.unreadDot} />
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagesOverview;