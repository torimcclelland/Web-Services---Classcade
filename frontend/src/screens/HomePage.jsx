import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import LogoutImg from "../assets/Logout.png";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import HomePageStyle from "../styles/HomePageStyle";
import AddNewProject from "./AddNewProject";
import ProfileCircle from "../components/ProfileCircle";

const HomePage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredNewBtn, setHoveredNewBtn] = useState(false);
  const [hoveredLogout, setHoveredLogout] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

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
        <ProfileCircle size={64} />
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
    </div>
  );
};

export default HomePage;
