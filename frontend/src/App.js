import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext";
import DashboardPage from "./screens/Dashboard";
import LogInPage from "./screens/LogIn";
import HomePage from "./screens/HomePage";
import TimeTracking from "./screens/TimeTracking";
import Profile from "./screens/Profile";
import MyTasks from "./screens/MyTasks";
import Calendar from "./screens/Calendar";
import SignUp from "./screens/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Stats from "./screens/Stats";
import Zoom from "./screens/Zoom";
import ZoomCallback from "./screens/ZoomCallback";
import StorePage from "./screens/Store";
import AddNewTask from "./screens/AddNewTask";
import ProjectSettings from "./screens/ProjectSettings";
import MessageThread from "./screens/MessageThread";
import MessagesRedirect from "./screens/MessagesRedirect";
import Landing from "./screens/Landing";

export default function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/zoom/callback" element={<ZoomCallback />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <MyTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/zoom"
              element={
                <ProtectedRoute>
                  <Zoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <StorePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-task"
              element={
                <ProtectedRoute>
                  <AddNewTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ProjectSettings />
                </ProtectedRoute>
              }
            />
            {/* Redirect /messages to current project's chat */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:conversationId"
              element={
                <ProtectedRoute>
                  <MessageThread />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ProjectProvider>
    </UserProvider>
  );
}
