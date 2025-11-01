import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./screens/Dashboard";
import LogInPage from "./screens/LogIn";
import HomePage from "./screens/HomePage";
import TimeTracking from "./screens/TimeTracking";
import Profile from "./screens/Profile";
import MyTasks from "./screens/MyTasks";
import Calendar from "./screens/Calendar";
import SignUp from "./screens/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Stats from './screens/Stats';
import Zoom from './screens/Zoom';
import StorePage from './screens/Store';
import AddNewProject from './screens/AddNewProject';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/signup" element={<SignUp />} />
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
          path="/timetracking"
          element={
            <ProtectedRoute>
              <TimeTracking />
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
          path="/addnewproject"
          element={
            <ProtectedRoute>
              <AddNewProject />
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
      </Routes>
    </Router>
  );
}