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
  const [confirmRemoveMember, setConfirmRemoveMember] = useState(null);
  const [confirmInvite, setConfirmInvite] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const currentUser = JSON.parse(localStorage.getItem("user"));

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
    if (dueDate) {
      const selected = new Date(dueDate);
      const tdy = new Date();
      tdy.setHours(0, 0, 0, 0);

      if (selected < tdy) {
        triggerToast("Due date cannot be in the past");
        return;
      }
    }

    try {
      await api.put(`/api/project/${selectedProject._id}`, { name, dueDate });
      setSelectedProject({ ...selectedProject, name, dueDate });
      triggerToast("Project updated!");
    } catch {
      triggerToast("Update failed");
    }
  };

  const handleAddMember = async () => {
    const trimmedEmail = newMemberEmail.trim().toLowerCase();
    
    // Check if user is adding their own email
    if (trimmedEmail === currentUser.email.toLowerCase()) {
      triggerToast("You're already in this project");
      setNewMemberEmail("");
      return;
    }

    try {
      // Check if user exists
      const userRes = await api.get(`/api/user/email/${trimmedEmail}`);
      const userId = userRes.data._id;

      // Check if user is already a member
      const isAlreadyMember = members.some(m => m._id === userId);
      if (isAlreadyMember) {
        triggerToast("User is already a member");
        setNewMemberEmail("");
        return;
      }

      await api.post(`/api/project/${selectedProject._id}/members`, { userId });

      const memRes = await api.get(
        `/api/project/${selectedProject._id}/members`
      );
      setMembers(memRes.data);
      setNewMemberEmail("");
      triggerToast("Member added!");
    } catch {
      // User not found - prompt for invitation
      setConfirmInvite(trimmedEmail);
    }
  };

  const handleSendInvite = async () => {
    try {
      await api.post('/api/user/invite', {
        email: confirmInvite,
        projectId: selectedProject._id,
        projectName: selectedProject.name,
        inviterName: `${currentUser.firstName} ${currentUser.lastName}`
      });
      
      triggerToast("Invitation sent!");
      setConfirmInvite(null);
      setNewMemberEmail("");
    } catch (err) {
      triggerToast("Failed to send invitation");
      setConfirmInvite(null);
    }
  };

  const handleRemoveMember = async (memberId, email) => {
    try {
      const isRemovingSelf = memberId === currentUser._id;
      const isLastMember = members.length === 1;

      if (isRemovingSelf && isLastMember) {
        // User is removing themselves and they're the last member - delete project
        await api.delete(`/api/project/${selectedProject._id}`);
        
        localStorage.removeItem("selectedProject");
        setSelectedProject(null);
        
        triggerToast("Project deleted");
        setConfirmRemoveMember(null);
        
        setTimeout(() => navigate("/home"), 1200);
      } else {
        // Remove the member
        await api.delete(
          `/api/project/${selectedProject._id}/members/${memberId}`
        );
        
        if (isRemovingSelf) {
          // User removed themselves - clear project and navigate home
          localStorage.removeItem("selectedProject");
          setSelectedProject(null);
          
          triggerToast("Left project");
          setConfirmRemoveMember(null);
          
          setTimeout(() => navigate("/home"), 1200);
        } else {
          // Removed someone else - refresh member list
          const memRes = await api.get(
            `/api/project/${selectedProject._id}/members`
          );
          setMembers(memRes.data);
          triggerToast(`Removed ${email}`);
          setConfirmRemoveMember(null);
        }
      }
    } catch {
      triggerToast("Failed to remove");
      setConfirmRemoveMember(null);
    }
  };

  const initiateRemoveMember = (memberId, email) => {
    setConfirmRemoveMember({ memberId, email });
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
          <input
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            min={today}
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
                  onClick={() => initiateRemoveMember(m._id, m.email)}
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

      {confirmRemoveMember && (
        <div className="overlay">
          <div className="popup">
            <p className="popupText">
              {confirmRemoveMember.memberId === currentUser._id
                ? members.length === 1
                  ? "You are the only member. Leaving will delete this project. Continue?"
                  : "Are you sure you want to leave this project?"
                : `Remove ${confirmRemoveMember.email} from this project?`}
            </p>
            <div className="popup-btns">
              <PrimaryButton
                text="Cancel"
                onClick={() => setConfirmRemoveMember(null)}
              />
              <SecondaryButton
                text={confirmRemoveMember.memberId === currentUser._id ? "Leave" : "Remove"}
                onClick={() =>
                  handleRemoveMember(
                    confirmRemoveMember.memberId,
                    confirmRemoveMember.email
                  )
                }
              />
            </div>
          </div>
        </div>
      )}

      {confirmInvite && (
        <div className="overlay">
          <div className="popup">
            <p className="popupText">
              {confirmInvite} is not registered with Classcade. Would you like to send them an invitation to join this project?
            </p>
            <div className="popup-btns">
              <PrimaryButton
                text="Cancel"
                onClick={() => {
                  setConfirmInvite(null);
                  setNewMemberEmail("");
                }}
              />
              <PrimaryButton
                text="Send Invite"
                onClick={handleSendInvite}
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ProjectSettings;
