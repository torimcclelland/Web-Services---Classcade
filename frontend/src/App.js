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
import TimeTracking from './screens/TimeTracking';
import Profile from './screens/Profile';
import MyTasks from './screens/MyTasks';
import Calendar from './screens/Calendar';
import AddNewGroup from './screens/AddNewGroup';
import Stats from './screens/Stats';
import Zoom from './screens/Zoom';
import StorePage from './screens/Store';

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
        <Route path = "/" element = {<LogInPage />}/>
        <Route path = "/home" element = {<HomePage />}/>
        <Route path = "/dashboard" element = {<DashboardPage />}/>
        <Route path = "/timetracking" element={<TimeTracking />} /> 
        <Route path = "/profile" element={<Profile />} />
        <Route path = "/tasks" element={<MyTasks />} />
        <Route path = "/calendar" element={<Calendar />} />
        <Route path = "/addnewgroup" element={<AddNewGroup />} />
        <Route path = "/stats" element={<Stats />} />
        <Route path = "/zoom" element={<Zoom />} />
        <Route path = "/store" element = {<StorePage />}/>
      </Routes>
    </Router>
  );
}