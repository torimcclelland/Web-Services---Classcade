import React, { useState, useEffect } from "react";
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
    FaUser,
} from "react-icons/fa";

import Logo from "../assets/Logo.png";
import "../styles/Sidebar.css";
import { useProject } from "../context/ProjectContext";
import { useUser } from "../context/UserContext";
import api from "../api";
import socketManager from "../utils/socketManager";

export default function Sidebar() {
    const navigate = useNavigate();
    const { selectedProject } = useProject();
    const { user } = useUser();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        if (!selectedProject?._id || !user?._id) return;

        try {
            const res = await api.get("/api/chat", {
                params: { conversationId: selectedProject._id }
            });

            const unread = res.data.filter(msg => {
                const senderId = msg.sender?._id || msg.sender;
                const isFromOther = senderId !== user._id;
                const isUnread = !msg.readBy?.some(r => {
                    const readerId = r.user?._id || r.user;
                    return readerId?.toString() === user._id?.toString();
                });
                return isFromOther && isUnread;
            }).length;

            console.log('[Sidebar] Unread count:', unread);
            setUnreadCount(unread);
        } catch (err) {
            console.error("Error fetching unread count:", err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
    }, [selectedProject, user]);

    useEffect(() => {
        if (!selectedProject?._id || !user?._id) return;

        socketManager.connect();

        const handleNewMessage = (msg) => {
            console.log('[Sidebar] Received message:', msg);
            if (msg.conversationId === selectedProject._id) {
                const senderId = msg.sender?._id || msg.sender;
                if (senderId !== user._id) {
                    console.log('[Sidebar] Incrementing unread count');
                    setUnreadCount(prev => prev + 1);
                }
            }
        };

        const handleChannelRead = ({ channelId, userId }) => {
            console.log('[Sidebar] Channel marked as read:', channelId, userId);
            if (userId === user._id) {
                fetchUnreadCount();
            }
        };

        socketManager.on("receiveMessage", handleNewMessage);
        socketManager.on("channelMarkedAsRead", handleChannelRead);

        return () => {
            socketManager.off("receiveMessage", handleNewMessage);
            socketManager.off("channelMarkedAsRead", handleChannelRead);
        };
    }, [selectedProject, user]);

    const items = [
        {
            key: "dashboard",
            label: "Dashboard",
            icon: <FaHome />,
            path: "/dashboard",
        },
        { key: "tasks", label: "Tasks", icon: <FaTasks />, path: "/tasks" },
        { key: "stats", label: "Stats", icon: <FaChartBar />, path: "/stats" },
        {
            key: "messages",
            label: "Messages",
            icon: <FaComments />,
            path: selectedProject?._id ? `/messages/${selectedProject._id}` : "/messages",
            badge: unreadCount > 0 ? unreadCount : null,
        },
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
                            style={{ position: 'relative' }}
                        >
                            <span className="cc-sidebar__icon">{item.icon}</span>
                            <span className="cc-sidebar__label">{item.label}</span>
                            {item.badge && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        borderRadius: '10px',
                                        padding: '2px 6px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        minWidth: '18px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
