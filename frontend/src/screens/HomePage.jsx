import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import LogoutImg from "../assets/Logout.png";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import HomePageStyle from "../styles/HomePageStyle";
import AddNewProject from "./AddNewProject";
import ProfileCircle from "../components/ProfileCircle";
import EditProfile from "../components/EditProfile";

const HomePage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredNewBtn, setHoveredNewBtn] = useState(false);
  const [hoveredLogout, setHoveredLogout] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileTab, setEditProfileTab] = useState('personal');
  const [userData, setUserData] = useState(null);

  const { setSelectedProject } = useProject();

  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      const res = await api.get(`/api/project/user/${user._id}/details`);
      setProjects(res.data || []);
    } catch (e) {
      console.error("Error fetching projects", e);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      const res = await api.get(`/api/user/${user._id}`);
      setFirstName(res.data.firstName || "");
    } catch (e) {
      console.error("Error fetching user info", e);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUserInfo();
  }, []);

  const handleCardClick = (project) => {
    setSelectedProject(project);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProject");
    setSelectedProject(null);
    navigate("/login");
  };

  const fetchUserData = async (retryCount = 0) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await api.get(`/api/user/${user._id}`);
        setUserData(response.data);
        return true;
      }
    } catch (error) {
      console.error(`Error fetching user data (attempt ${retryCount + 1}/3):`, error);
      
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1)));
        return fetchUserData(retryCount + 1);
      }
      
      console.error('Failed to fetch user data after 3 attempts');
      return false;
    }
  };

  const handleEditAccount = async () => {
    setEditProfileTab('personal');
    await fetchUserData();
    setShowEditProfile(true);
  };

  const handleCustomization = async () => {
    setEditProfileTab('customization');
    await fetchUserData();
    setShowEditProfile(true);
  };

  const handleSaveProfile = async (updates) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return { success: false, error: 'User not found' };

      const user = JSON.parse(storedUser);
      const currentUserData = userData || JSON.parse(storedUser);

      if (updates.firstName !== currentUserData.firstName || updates.lastName !== currentUserData.lastName) {
        await api.put(`/api/user/${user._id}/updatename`, {
          firstName: updates.firstName,
          lastName: updates.lastName,
        });
      }

      if (updates.email !== currentUserData.email) {
        await api.put(`/api/user/${user._id}/updateemail`, {
          email: updates.email,
        });
      }

      if (updates.username !== currentUserData.username) {
        await api.put(`/api/user/${user._id}/updateusername`, {
          username: updates.username,
        });
      }

      if (updates.password) {
        await api.put(`/api/user/${user._id}/updatepassword`, {
          password: updates.password,
        });
      }

      const customizationsChanged = 
        updates.selectedIcon !== currentUserData.selectedIcon ||
        updates.selectedBanner !== currentUserData.selectedBanner ||
        updates.selectedBackdrop !== currentUserData.selectedBackdrop;

      if (customizationsChanged) {
        await api.put(`/api/user/${user._id}/updateselections`, {
          selectedIcon: updates.selectedIcon,
          selectedBanner: updates.selectedBanner,
          selectedBackdrop: updates.selectedBackdrop,
        });
      }

      const updatedUserResponse = await api.get(`/api/user/${user._id}`);
      localStorage.setItem('user', JSON.stringify(updatedUserResponse.data));
      setUserData(updatedUserResponse.data);

      window.dispatchEvent(new Event('userUpdated'));

      return { success: true };
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
      return { success: false, error: errorMessage };
    }
  };

  const handleProjectCreated = (createdProject) => {
    // If a created project is provided, select it and go to dashboard
    const project = createdProject?.project;

    if (project && project._id) {
      setSelectedProject(project);
      // Save selection to localStorage for persistence
      localStorage.setItem("selectedProject", JSON.stringify(project));
      navigate("/dashboard");
      return;
    }

    // Otherwise just refresh the projects list
    fetchProjects();
  };

  return (
    <div style={HomePageStyle.page}>
      <div
        // profile icon
        style={{
          position: "fixed",
          top: 72,
          right: 56,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {" "}
        <ProfileCircle 
          size={64} 
          onEditAccount={handleEditAccount}
          onCustomization={handleCustomization}
        />
      </div>
      <div style={HomePageStyle.inner}>
        <button style={HomePageStyle.logoutBtn} onClick={handleLogout}>
          <img src={LogoutImg} alt="logout" style={{ width: 26, height: 31 }} />
        </button>

        <img src={Logo} alt="logo" style={{ width: 120, height: 120 }} />

        <h1 style={HomePageStyle.heading}>
          Welcome to CLASSCADE{firstName ? `, ${firstName}` : ""}!
        </h1>
        <div style={HomePageStyle.subtitle}>
          Click a project or create a new one to get started
        </div>

        <div style={HomePageStyle.list}>
          {projects.map((g, index) => (
            <div
              key={g._id || index}
              style={{
                ...HomePageStyle.card,
                backgroundColor: hoveredCard === index ? "#f5f5f5" : "#fff",
                transition: "background-color 0.2s ease",
              }}
              onClick={() => handleCardClick(g)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={HomePageStyle.cardLeft}>
                <div
                  style={{
                    ...HomePageStyle.badge,
                    backgroundColor: hoveredCard === index ? "#f5f5f5" : "#fff",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {index + 1}.
                </div>
                <div style={HomePageStyle.cardContent}>
                  <div style={HomePageStyle.cardTitle}>{g.name}</div>
                  <div style={HomePageStyle.cardMeta}>
                    <div style={HomePageStyle.metaText}>
                      Members: {g.members?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          style={{
            ...HomePageStyle.newProjectBtn,
            backgroundColor: hoveredNewBtn ? "#f4f4f4ff" : "#fff",
            transition: "background-color 0.2s ease",
          }}
          onClick={() => setShowAddProjectModal(true)}
          onMouseEnter={() => setHoveredNewBtn(true)}
          onMouseLeave={() => setHoveredNewBtn(false)}
        >
          + New Project
        </button>
      </div>

      <AddNewProject
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={userData}
        onSave={handleSaveProfile}
        initialTab={editProfileTab}
      />
    </div>
  );
};

export default HomePage;
