import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaComments,
  FaCog,
  FaPencilAlt,
  FaChartBar,
  FaCamera
} from 'react-icons/fa';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { key: 'tasks', label: 'My Tasks', icon: <FaTasks />, path: '/tasks' },
    { key: 'timetracking', label: 'Time Tracking', icon: <FaCalendarAlt />, path: '/timetracking' },
    { key: 'profile', label: 'Profile', icon: <FaComments />, path: '/profile' },
    { key: 'home', label: 'Home', icon: <FaCog />, path: '/home' },
    { key: 'stats', label: 'Stats', icon: <FaChartBar />, path: '/stats'},
    { key: 'addnewgroup', label: 'Add New Group', icon: <FaPencilAlt />, path: '/addnewgroup' },
    { key: 'zoom', label: 'Zoom', icon: <FaCamera />, path: '/zoom' }
  ];

  return (
    <aside className="cc-sidebar">
      <div className="cc-sidebar__inner">
        <div className="cc-sidebar__brand">
          <div className="cc-sidebar__brandMark" />
          <span className="cc-sidebar__brandText">CLASSCADE</span>
        </div>

        <nav className="cc-sidebar__nav">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `cc-sidebar__item ${isActive ? 'is-active' : ''} ${
                  isActive && item.key === 'tasks' ? '' : ''
                }`
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