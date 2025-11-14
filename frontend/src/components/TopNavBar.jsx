import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBarStyle from "../styles/TopNavBarStyle";
import { 
  FaHome,
  FaPlus 
} from "react-icons/fa";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import { getUserBanner } from "../constants/storeItems";
import AddNewProject from "../screens/AddNewProject";

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
  const [homeHover, setHomeHover] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [addBtnHover, setAddBtnHover] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

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

  const goToDashboard = () => navigate("/dashboard");
  
  const handleProjectCreated = async (createdProject) => {
    // If a created project is provided, select it and go to dashboard
    if (createdProject && createdProject._id) {
      setSelectedProject(createdProject);
      try { localStorage.setItem('selectedProject', JSON.stringify(createdProject)); } catch (e) {}
      setShowAddProjectModal(false);
      navigate('/dashboard');
      return;
    }

    // Otherwise refresh the projects list
    if (!user?._id) return;
    try {
      const res = await api.get(`/api/project/user/${user._id}`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching user projects:", err);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    navigate("/dashboard");
  };

  return (
    <>
      <div style={{ ...TopNavBarStyle.topNavbar, backgroundColor: bannerColor }}>
      <button 
        style={{
          ...TopNavBarStyle.homeBtn,
          backgroundColor: homeHover ? '#ffffffe2' : 'transparent',
          transition: 'none',
          //borderRadius: '50%',
          borderRadius: 12,
          width: 35,
          height: 35,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
        }}
        onMouseEnter={() => setHomeHover(true)}
        onMouseLeave={() => setHomeHover(false)}
        onClick={goToDashboard}
      >
        <FaHome size={24} />
      </button>

      <div style={TopNavBarStyle.projectTabs}>
        {projects.map((proj) => {
          const isActive = selectedProject?._id === proj._id;
          const activeTabColor = darkenColor(bannerColor, 25);
          const isHovered = hoveredTab === proj._id;

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
                  : {
                      backgroundColor: isHovered ? '#f6f6f6f1' : '#fff',
                    }),
                transition: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={() => !isActive && setHoveredTab(proj._id)}
              onMouseLeave={() => setHoveredTab(null)}
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

        <button 
          style={{
            ...TopNavBarStyle.addTabBtn,
            backgroundColor: addBtnHover ? '#ffffffe2' : 'transparent',
            borderRadius: '50%',
            transform: 'translateY(5px)',
            bottom: '10px',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'none',
            color: addBtnHover ? '#000' : '#000',
          }}
          onMouseEnter={() => setAddBtnHover(true)}
          onMouseLeave={() => setAddBtnHover(false)}
          onClick={() => setShowAddProjectModal(true)}
          aria-label="Add new project"
        >
          <FaPlus size = {20}/>
        </button>
      </div>
      </div>

      <AddNewProject 
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
};

export default TopNavBar;
