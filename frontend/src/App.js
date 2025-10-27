import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskDemo from "./components/TaskDemo";
import ChatDemo from "./components/ChatDemo";
import ProjectDemo from "./components/ProjectDemo";
import NotificationDemo from "./components/NotificationDemo";
import UserDemo from "./components/UserDemo";
import DashboardPage from "./screens/Dashboard";
import LogInPage from "./screens/LogIn";
import HomePage from "./screens/HomePage";
import TimeTracking from './screens/TimeTracking';
import Profile from './screens/Profile';
import MyTasks from './screens/MyTasks';
import StorePage from './screens/Store';

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
    <Router>
      <Routes>
        <Route path = "/" element = {<LogInPage />}/>
        <Route path = "/home" element = {<HomePage />}/>
        <Route path = "/dashboard" element = {<DashboardPage />}/>
        <Route path = "/timetracking" element={<TimeTracking />} /> 
        <Route path = "/profile" element={<Profile />} />
        <Route path = "/tasks" element={<MyTasks />} />
        <Route path = "/store" element = {<StorePage />}/>
      </Routes>
    </Router>
  );
}