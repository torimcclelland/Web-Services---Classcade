import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import MessageThreadStyle from "../styles/MessageThreadStyle";
import api from "../api";
import { useUser } from "../context/UserContext";

const socket = io("http://localhost:4000");

const MessageThread = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const currentUserId = user?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", conversationId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/api/chat?conversationId=${conversationId}`);
        const messages = res.data.reverse(); // oldest first
        setMessages(messages);

        // Mark each message as read
        await Promise.all(
          messages.map((msg) =>
            api.post(`/api/chat/${msg._id}/read`, { userId: currentUserId })
          )
        );

        console.log("Marked as read:", messages.map(m => m._id));

      } catch (err) {
        console.error("Error loading message history:", err);
      }
    };

    fetchHistory();
  }, [conversationId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      conversationId,
      sender: currentUserId,
      content: input,
      recipients: [], // optional
    };

    try {
      socket.emit("sendMessage", msg);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div style={MessageThreadStyle.container}>
      <TopNavBar />
      <div style={MessageThreadStyle.layout}>
        <SideBar />
        <main style={MessageThreadStyle.main}>
          <button style={MessageThreadStyle.backButton} onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div style={MessageThreadStyle.chatWindow}>
            {messages.map((msg) => (
              <div key={msg._id} style={MessageThreadStyle.messageBubble}>
                <strong>{msg.sender}</strong>
                <span>{msg.content}</span>
                <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={MessageThreadStyle.inputArea}>
            <input
              style={MessageThreadStyle.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button style={MessageThreadStyle.sendButton} onClick={sendMessage}>
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessageThread;