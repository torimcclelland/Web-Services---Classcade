import React, { useState } from "react";
import api from "../api";

export default function NotificationDemo() {
  const [userId, setUserId] = useState("");
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const res = await api.get(`/api/notification/user/${userId}`);
    setNotifications(res.data);
  };

  return (
    <div>
      <h2>Notification Demo</h2>
      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={loadNotifications}>Load Notifications</button>

      <ul>
        {notifications.map((n) => (
          <li key={n._id}>{n.message || "(No message)"}</li>
        ))}
      </ul>
    </div>
  );
}