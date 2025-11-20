import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBarStyle from "../styles/TopNavBarStyle";
import { FaHome, FaPlus } from "react-icons/fa";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import { getUserBanner } from "../constants/storeItems";
import AddNewProject from "../screens/AddNewProject";
import ProfileCircle from "../components/ProfileCircle"

// Helper function to darken a hex color for
const darkenColor = (hex, percent = 20) => {
  hex = hex.replace("#", "");

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.max(0, Math.floor(r * (1 - percent / 100)));
  g = Math.max(0, Math.floor(g * (1 - percent / 100)));
  b = Math.max(0, Math.floor(b * (1 - percent / 100)));

  const rr = r.toString(16).padStart(2, "0");
  const gg = g.toString(16).padStart(2, "0");
  const bb = b.toString(16).padStart(2, "0");

  return `#${rr}${gg}${bb}`;
};

const TopNavBar = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [bannerColor, setBannerColor] = useState("#DDF9EA");
  const [homeHover, setHomeHover] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [addBtnHover, setAddBtnHover] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [projectToLeave, setProjectToLeave] = useState(null);
  const [isLastMember, setIsLastMember] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");

  const { selectedProject, setSelectedProject } = useProject();

  const user = JSON.parse(localStorage.getItem("user"));

  // Get user's selected banner color
  const updateBannerColor = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setBannerColor(getUserBanner(user.selectedBanner));
      }
    } catch (error) {
      console.error("Error getting banner color:", error);
      setBannerColor("#DDF9EA"); // fallback to default
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
    window.addEventListener("userUpdated", updateBannerColor);
    window.addEventListener("storage", updateBannerColor);

    return () => {
      window.removeEventListener("userUpdated", updateBannerColor);
      window.removeEventListener("storage", updateBannerColor);
    };
  }, [user]);

  const goToHome = () => navigate("/home");

  const handleProjectCreated = async (createdProject) => {
    // If a created project is provided, select it and go to dashboard
    const project = createdProject?.project;

    if (project && project._id) {
      setSelectedProject(project);
      try {
        localStorage.setItem("selectedProject", JSON.stringify(createdProject));
      } catch (e) {}
      setShowAddProjectModal(false);
      navigate("/dashboard");
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

  const handleLeaveProjectClick = async (e, project) => {
    e.stopPropagation();

    try {
      // Fetch project details to check member count
      const response = await api.get(`/api/project/${project._id}/members`);
      const members = response.data;

      setProjectToLeave(project);
      setIsLastMember(members.length === 1);
      setShowLeaveConfirmation(true);
    } catch (err) {
      console.error("Error checking project members:", err);
    }
  };

  const confirmLeaveProject = async () => {
    if (!projectToLeave || !user?._id) return;

    try {
      const projectName = projectToLeave.name;
      const wasLastMember = isLastMember;

      if (isLastMember) {
        // Delete the entire project if user is the last member
        await api.delete(`/api/project/${projectToLeave._id}`);
      } else {
        // Remove user from project members
        await api.delete(
          `/api/project/${projectToLeave._id}/members/${user._id}`
        );
      }

      // Refresh projects list
      const res = await api.get(`/api/project/user/${user._id}`);
      setProjects(res.data);

      // If the project being left is currently selected, clear selection
      if (selectedProject?._id === projectToLeave._id) {
        setSelectedProject(null);
        localStorage.removeItem("selectedProject");
        navigate("/home");
      }

      setShowLeaveConfirmation(false);
      setProjectToLeave(null);
      setIsLastMember(false);

      // Show success message
      setSuccessMessageText(
        wasLastMember
          ? `Project "${projectName}" has been deleted.`
          : `You have left "${projectName}".`
      );
      setShowSuccessMessage(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Error leaving/deleting project:", err);
      setShowLeaveConfirmation(false);
      setProjectToLeave(null);
      setIsLastMember(false);
    }
  };

  const cancelLeaveProject = () => {
    setShowLeaveConfirmation(false);
    setProjectToLeave(null);
    setIsLastMember(false);
  };

  return (
    <>
      <div
        style={{ ...TopNavBarStyle.topNavbar, backgroundColor: bannerColor }}
      >
        <button
          style={{
            ...TopNavBarStyle.homeBtn,
            backgroundColor: homeHover ? "#ffffffe2" : "transparent",
            transition: "none",
            //borderRadius: '50%',
            borderRadius: 12,
            width: 35,
            height: 35,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
          }}
          onMouseEnter={() => setHomeHover(true)}
          onMouseLeave={() => setHomeHover(false)}
          onClick={goToHome}
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
                        color: "#fff",
                      }
                    : {
                        backgroundColor: isHovered ? "#f6f6f6f1" : "#fff",
                      }),
                  transition: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={() => !isActive && setHoveredTab(proj._id)}
                onMouseLeave={() => setHoveredTab(null)}
                onClick={() => handleSelectProject(proj)}
              >
                <span>{proj.name}</span>
                <button
                  style={
                    isActive
                      ? { ...TopNavBarStyle.closeTabBtn, color: "#fff" }
                      : TopNavBarStyle.closeTabBtn
                  }
                  onClick={(e) => handleLeaveProjectClick(e, proj)}
                >
                  ✕
                </button>
              </div>
            );
          })}

          <button
            style={{
              ...TopNavBarStyle.addTabBtn,
              backgroundColor: addBtnHover ? "#ffffffe2" : "transparent",
              borderRadius: "50%",
              transform: "translateY(5px)",
              bottom: "10px",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "none",
              color: addBtnHover ? "#000" : "#000",
            }}
            onMouseEnter={() => setAddBtnHover(true)}
            onMouseLeave={() => setAddBtnHover(false)}
            onClick={() => setShowAddProjectModal(true)}
            aria-label="Add new project"
          >
            <FaPlus size={20} />
          </button>
        </div>
                <div style={TopNavBarStyle.profileContainer}>
                  <ProfileCircle size={40} />
                </div>
      </div>

      <AddNewProject
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Leave/Delete Project Confirmation Popup */}
      {showLeaveConfirmation && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2000,
            }}
            onClick={cancelLeaveProject}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              zIndex: 2001,
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              {isLastMember ? "Delete Project?" : "Leave Project?"}
            </h2>
            <p
              style={{
                margin: "0 0 1.5rem 0",
                fontSize: "1rem",
                color: "#374151",
                lineHeight: "1.5",
              }}
            >
              {isLastMember
                ? `You are the only member of "${projectToLeave?.name}". Leaving will permanently delete this project. This action cannot be undone.`
                : `Are you sure you want to leave "${projectToLeave?.name}"?`}
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  padding: "0.625rem 1.25rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                  color: "#374151",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onClick={cancelLeaveProject}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "0.625rem 1.25rem",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: isLastMember ? "#dc2626" : "#1e3a8a",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onClick={confirmLeaveProject}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = isLastMember
                    ? "#b91c1c"
                    : "#1e40af")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = isLastMember
                    ? "#dc2626"
                    : "#1e3a8a")
                }
              >
                {isLastMember ? "Delete Project" : "Leave Project"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Success Message Popup */}
      {showSuccessMessage && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2000,
            }}
            onClick={() => setShowSuccessMessage(false)}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              zIndex: 2001,
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#d1fae5",
                margin: "0 auto 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                  color: "#065f46",
                }}
              >
                ✓
              </span>
            </div>
            <h2
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              Success!
            </h2>
            <p
              style={{
                margin: "0",
                fontSize: "1rem",
                color: "#374151",
                lineHeight: "1.5",
              }}
            >
              {successMessageText}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default TopNavBar;
