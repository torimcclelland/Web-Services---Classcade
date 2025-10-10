import React, { useState } from "react";
import api from "../api";

export default function ChatDemo() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    await api.post("/api/chat", {
      conversationId: "652e4b9a5f6d2a1b3c4d5e6f",
      sender: "652e4b9a5f6d2a1b3c4d5e70",
      recipients: ["652e4b9a5f6d2a1b3c4d5e71"],
      content,
      contentType: "text",
    });
    getMessages();
  };

  const getMessages = async () => {
    const res = await api.get("/api/chat?limit=10");
    setMessages(res.data);
  };

  return (
    <div>
      <h2>Chat Demo</h2>
      <input
        placeholder="Message content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={getMessages}>Refresh</button>
      <ul>
        {messages.map((m) => (
          <li key={m._id}>{m.content}</li>
        ))}
      </ul>
    </div>
  );
}