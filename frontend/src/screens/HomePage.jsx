import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import LogoutImg from "../assets/Logout.png";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import HomePageStyle from "../styles/HomePageStyle";
import AddNewProject from "./AddNewProject";
import AddNewTaskModal from "./AddNewTask";
import ModalWrapper from "../components/ModalWrapper";
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
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskProject, setTaskProject] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileTab, setEditProfileTab] = useState('personal');
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { setSelectedProject } = useProject();

  const triggerToast = (text) => {
    setToast(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

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

  const handleAddTask = (e, project) => {
    e.stopPropagation();
    setTaskProject(project);
    setSelectedProject(project);
    setShowAddTaskModal(true);
  };

  const handleTaskSuccess = () => {
    setShowAddTaskModal(false);
    setTaskProject(null);
    triggerToast("Task created successfully!");
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
    localStorage.removeItem('userProjectsTimestamp');
    window.dispatchEvent(new Event('projectsUpdated'));
    
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
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#1e3a8a",
            color: "white",
            padding: "12px 18px",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: "500",
            zIndex: 2000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {toast}
        </div>
      )}
      <div
        // profile icon
        style={{
          position: "fixed",
          top: 72,
          right: 56,
          zIndex: 100,
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

        {projects.length === 0 ? (
          <div style={HomePageStyle.emptyState}>
            <div style={HomePageStyle.emptyStateIcon}>📋</div>
            <h2 style={HomePageStyle.emptyStateTitle}>No Projects Yet</h2>
            <p style={HomePageStyle.emptyStateDescription}>
              Get started by creating a project! Projects help you organize tasks, 
              collaborate with team members, and track progress all in one place.
            </p>
            <button
              style={{
                ...HomePageStyle.emptyStateCTA,
                backgroundColor: hoveredNewBtn ? "#1e40af" : "#1e3a8a",
              }}
              onClick={() => setShowAddProjectModal(true)}
              onMouseEnter={() => setHoveredNewBtn(true)}
              onMouseLeave={() => setHoveredNewBtn(false)}
            >
              🚀 Create Your First Project
            </button>
          </div>
        ) : (
          <>
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
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#1e3a8a",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      transition: "background-color 0.2s ease",
                    }}
                    onClick={(e) => handleAddTask(e, g)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#1e40af"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#1e3a8a"}
                  >
                    + Add Task
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
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

      {showAddTaskModal && taskProject && (
        <ModalWrapper onClose={() => setShowAddTaskModal(false)}>
          <AddNewTaskModal
            task={null}
            onClose={() => setShowAddTaskModal(false)}
            onSuccess={handleTaskSuccess}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

export default HomePage;
