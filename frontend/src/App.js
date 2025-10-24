import React, { useState } from "react";
import TaskDemo from "./components/TaskDemo";
import ChatDemo from "./components/ChatDemo";
import ProjectDemo from "./components/ProjectDemo";
import NotificationDemo from "./components/NotificationDemo";
import UserDemo from "./components/UserDemo";
import DashboardPage from "./screens/Dashboard";
import LogInPage from "./screens/LogIn";

export default function App() {
  const [tab, setTab] = useState("task");

  const components = {
    task: <TaskDemo />,
    chat: <ChatDemo />,
    project: <ProjectDemo />,
    notification: <NotificationDemo />,
    user: <UserDemo />,
  };

  return (
    <div style={{ padding: 20 }}>
      <DashboardPage />
      {/* <h1>Backend Integration Demo</h1>
      <div style={{ marginBottom: 10 }}>
        {Object.keys(components).map((k) => (
          <button key={k} onClick={() => setTab(k)} style={{ marginRight: 5 }}>
            {k}
          </button>
        ))}
      </div>
      <div style={{ border: "1px solid #ccc", padding: 10 }}>
        {components[tab]}
      </div> */}
    </div>
  );
}