import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBarStyle from "../styles/TopNavBarStyle";
import { FaHome } from "react-icons/fa";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import { getUserBanner } from "../constants/storeItems";

// Helper function to darken a hex color for 
const darkenColor = (hex, percent = 20) => {
  hex = hex.replace('#', '');
  
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  r = Math.max(0, Math.floor(r * (1 - percent / 100)));
  g = Math.max(0, Math.floor(g * (1 - percent / 100)));
  b = Math.max(0, Math.floor(b * (1 - percent / 100)));
  
  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = b.toString(16).padStart(2, '0');
  
  return `#${rr}${gg}${bb}`;
};

const TopNavBar = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [bannerColor, setBannerColor] = useState('#DDF9EA');

  const { selectedProject, setSelectedProject } = useProject();

  const user = JSON.parse(localStorage.getItem("user"));

  // Get user's selected banner color
  const updateBannerColor = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setBannerColor(getUserBanner(user.selectedBanner));
      }
    } catch (error) {
      console.error('Error getting banner color:', error);
      setBannerColor('#DDF9EA'); // fallback to default
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/api/project/user/${user._id}`);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching user projects:", err);
      }
    };

    fetchProjects();
    updateBannerColor();

    // Listen for user updates
    window.addEventListener('userUpdated', updateBannerColor);
    window.addEventListener('storage', updateBannerColor);

    return () => {
      window.removeEventListener('userUpdated', updateBannerColor);
      window.removeEventListener('storage', updateBannerColor);
    };
  }, [user]);

  const goToHome = () => navigate("/home");
  const goToAddNewProject = () => navigate("/addnewproject");

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    navigate("/dashboard");
  };

  return (
    <div style={{ ...TopNavBarStyle.topNavbar, backgroundColor: bannerColor }}>
      <button style={TopNavBarStyle.homeBtn} onClick={goToHome}>
        <FaHome size={24} />
      </button>

      <div style={TopNavBarStyle.projectTabs}>
        {projects.map((proj) => {
          const isActive = selectedProject?._id === proj._id;
          const activeTabColor = darkenColor(bannerColor, 25);

          return (
            <div
              key={proj._id}
              style={{
                ...TopNavBarStyle.projectTab,
                ...(isActive
                  ? {
                      ...TopNavBarStyle.activeTab,
                      backgroundColor: activeTabColor,
                      color: '#fff',
                    }
                  : {}),
              }}
              onClick={() => handleSelectProject(proj)}
            >
              <span>{proj.name}</span>
              <button
                style={isActive ? { ...TopNavBarStyle.closeTabBtn, color: '#fff' } : TopNavBarStyle.closeTabBtn}
                onClick={(e) => e.stopPropagation()}
              >
                ✕
              </button>
            </div>
          );
        })}

        <button style={TopNavBarStyle.addTabBtn} onClick={goToAddNewProject}>
          ＋
        </button>
      </div>

      <button style={TopNavBarStyle.exitBtn}>✕</button>
    </div>
  );
};

export default TopNavBar;
