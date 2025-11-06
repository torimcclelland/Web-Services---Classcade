import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import Sidebar from "../components/Sidebar";
import PrimaryButton from "../components/PrimaryButton";
import { useProject } from "../context/ProjectContext";
import api from "../api";
import "../styles/ProjectSettings.css";

const ProjectSettings = () => {
  const navigate = useNavigate();
  const { selectedProject, setSelectedProject, loadingProject } = useProject();

  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loadingProject && !selectedProject) {
      navigate("/home");
    }
  }, [loadingProject, selectedProject, navigate]);

  useEffect(() => {
    if (!selectedProject?._id) return;

    setName(selectedProject.name);
    setDueDate(selectedProject.dueDate?.substring(0, 10) || "");

    const fetchMembers = async () => {
      try {
        const res = await api.get(
          `/api/project/${selectedProject._id}/members`
        );
        setMembers(res.data);
      } catch (err) {
        console.log("Failed to fetch members:", err);
      }
    };

    fetchMembers();
  }, [selectedProject]);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/project/${selectedProject._id}`, {
        name,
        dueDate,
      });

      setSelectedProject({ ...selectedProject, name, dueDate });
      setMessage("Project updated successfully!");
    } catch (err) {
      setMessage("Failed updating project");
    }
  };

  const handleAddMember = async () => {
    try {
      const userRes = await api.get(`/api/user/email/${newMemberEmail}`);
      const userId = userRes.data._id;

      await api.post(`/api/project/${selectedProject._id}/members`, {
        userId,
      });

      const memRes = await api.get(
        `/api/project/${selectedProject._id}/members`
      );
      setMembers(memRes.data);
      setNewMemberEmail("");

      setMessage("Member added!");
    } catch (err) {
      setMessage("Failed to add member. Make sure email exists.");
    }
  };

  const handleRemoveMember = async (memberId, email) => {
    try {
      await api.delete(
        `/api/project/${selectedProject._id}/members/${memberId}`
      );

      const memRes = await api.get(
        `/api/project/${selectedProject._id}/members`
      );
      setMembers(memRes.data);

      setMessage(`Removed ${email}`);
    } catch (err) {
      console.log("Failed to remove member:", err);
      setMessage("Failed to remove member");
    }
  };

  if (!selectedProject) return null;

  return (
    <div className="settings-container">
      <TopNavBar />
      <div className="settings-layout">
        <Sidebar />

        <main className="settings-main">
          <h2>Project Settings</h2>

          {message && <p className="settings-message">{message}</p>}

          <div className="settings-grid">
            <div className="settings-panel">
              <label>Project Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />

              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <PrimaryButton text="Update Project" onClick={handleUpdate} />
            </div>

            <div className="settings-panel">
              <h3>Members</h3>

              <ul className="member-list">
                {members.map((m) => (
                  <li key={m._id} className="member-item">
                    <span>{m.email}</span>
                    <button
                      className="remove-member-btn"
                      onClick={() => handleRemoveMember(m._id, m.email)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <label>Add Member by Email</label>
              <input
                placeholder="member's email"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />

              <PrimaryButton text="Add Member" onClick={handleAddMember} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectSettings;
