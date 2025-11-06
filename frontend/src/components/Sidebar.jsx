import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaComments,
  FaCog,
  FaPencilAlt,
  FaChartBar,
  FaCamera,
  FaShoppingBag,
} from "react-icons/fa";

import Logo from "../assets/Logo.png";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    { key: "tasks", label: "My Tasks", icon: <FaTasks />, path: "/tasks" },
    {
      key: "timetracking",
      label: "Time Tracking",
      icon: <FaCalendarAlt />,
      path: "/timetracking",
    },
    // { key: 'profile', label: 'Profile', icon: <FaComments />, path: '/profile' },
    //{ key: 'home', label: 'Home', icon: <FaCog />, path: '/home' },
    // WIP:  { key: 'messages', label: 'Messages', icon: <FaComments />, path: '/messages' },
    { key: "stats", label: "Stats", icon: <FaChartBar />, path: "/stats" },
    // { key: 'addnewgroup', label: 'Add New Group', icon: <FaPencilAlt />, path: '/addnewgroup' },
    { key: "zoom", label: "Zoom", icon: <FaCamera />, path: "/zoom" },
    { key: "store", label: "Shop", icon: <FaShoppingBag />, path: "/store" },
    { key: "settings", label: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <aside className="cc-sidebar">
      <div className="cc-sidebar__inner">
        <button
          className="cc-sidebar__brand"
          onClick={() => navigate("/home")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            color: "white",
          }}
          aria-label="Go to home page"
        >
          <img src={Logo} alt="Classcade Logo" className="cc-sidebar__logo" />
          <span className="cc-sidebar__brandText">CLASSCADE</span>
        </button>

        <nav className="cc-sidebar__nav">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `cc-sidebar__item ${isActive ? "is-active" : ""}`
              }
            >
              <span className="cc-sidebar__icon">{item.icon}</span>
              <span className="cc-sidebar__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
