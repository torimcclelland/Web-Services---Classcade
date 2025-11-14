import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
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
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const triggerToast = (text) => {
    setToast(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
    if (!loadingProject && !selectedProject) navigate("/home");
  }, [loadingProject, selectedProject, navigate]);

  useEffect(() => {
    if (!selectedProject?._id) return;

    setName(selectedProject.name);

    if (selectedProject.dueDate) {
      const date = new Date(selectedProject.dueDate);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      setDueDate(date.toISOString().substring(0, 10));
    } else {
      setDueDate("");
    }

    const fetchMembers = async () => {
      try {
        const res = await api.get(
          `/api/project/${selectedProject._id}/members`
        );
        setMembers(res.data);
      } catch {}
    };

    fetchMembers();
  }, [selectedProject]);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/project/${selectedProject._id}`, { name, dueDate });
      setSelectedProject({ ...selectedProject, name, dueDate });
      triggerToast("Project updated!");
    } catch {
      triggerToast("Update failed");
    }
  };

  const handleAddMember = async () => {
    try {
      const userRes = await api.get(`/api/user/email/${newMemberEmail}`);
      const userId = userRes.data._id;

      await api.post(`/api/project/${selectedProject._id}/members`, { userId });

      const memRes = await api.get(
        `/api/project/${selectedProject._id}/members`
      );
      setMembers(memRes.data);
      setNewMemberEmail("");
      triggerToast("Member added!");
    } catch {
      triggerToast("Email not found");
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
      triggerToast(`Removed ${email}`);
    } catch {
      triggerToast("Failed to remove");
    }
  };

  const deleteProject = async () => {
    try {
      await api.delete(`/api/project/${selectedProject._id}`);

      localStorage.removeItem("selectedProject");
      setSelectedProject(null);

      triggerToast("Project deleted");
      setConfirmDelete(false);

      setTimeout(() => navigate("/home"), 1200);
    } catch {
      triggerToast("Delete failed");
      setConfirmDelete(false);
    }
  };

  if (!selectedProject) return null;

  return (
    <MainLayout showSidebar={true}>
      {showToast && <div className="toast show">{toast}</div>}

      <h2>Project Settings</h2>

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

              <div className="settings-button-row">
                <PrimaryButton text="Update Project" onClick={handleUpdate} />
                <SecondaryButton
                  text="Delete Project"
                  onClick={() => setConfirmDelete(true)}
                />
              </div>
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
                placeholder="member@example.com"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />

              <PrimaryButton text="Add Member" onClick={handleAddMember} />
            </div>
          </div>

      {confirmDelete && (
        <div className="overlay">
          <div className="popup">
            <p className="popupText">
              Delete this project? This cannot be undone.
            </p>
            <div className="popup-btns">
              <PrimaryButton
                text="Cancel"
                onClick={() => setConfirmDelete(false)}
              />
              <SecondaryButton text="Delete" onClick={deleteProject} />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ProjectSettings;
