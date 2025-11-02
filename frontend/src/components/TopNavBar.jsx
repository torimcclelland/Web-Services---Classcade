import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBarStyle from '../styles/TopNavBarStyle';
import { FaHome } from 'react-icons/fa';
import api from '../api';
import { useProject } from '../context/ProjectContext';

const TopNavBar = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  const { currentProject, setCurrentProject } = useProject();

  const user = JSON.parse(localStorage.getItem("user"));

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
  }, [user]);

  const goToHome = () => navigate('/home');
  const goToAddNewProject = () => navigate('/addnewproject');

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    navigate('/dashboard');
  };

  return (
    <div style={TopNavBarStyle.topNavbar}>
      <button style={TopNavBarStyle.homeBtn} onClick={goToHome}>
        <FaHome size={24} />
      </button>

      <div style={TopNavBarStyle.groupTabs}>
        {projects.map((proj) => {
          const isActive = currentProject?._id === proj._id;

          return (
            <div
              key={proj._id}
              style={{
                ...TopNavBarStyle.groupTab,
                ...(isActive ? TopNavBarStyle.activeTab : {})
              }}
              onClick={() => handleSelectProject(proj)}
            >
              <span>{proj.name}</span>
              <button
                style={TopNavBarStyle.closeTabBtn}
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