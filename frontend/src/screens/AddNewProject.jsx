import React, { useState, useEffect } from "react";
import api from "../api";

const AddNewProject = ({ isOpen, onClose, onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [groupmateEmails, setGroupmateEmails] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setProjectName("");
      setTeacherEmail("");
      setGroupmateEmails("");
      setError("");
      setSuccessMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not logged in");
      return;
    }

    const emails = groupmateEmails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    setIsCreating(true);
    try {
      const response = await api.post("/api/project/create", {
        userId: user._id,
        name: projectName,
        teacherEmail,
        groupmateEmails: emails,
      });

      setSuccessMessage("Project created successfully!");
      
      // Notify parent component and close modal after brief delay
      setTimeout(() => {
        if (onProjectCreated) {
          onProjectCreated(response.data);
        }
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error creating project");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setProjectName("");
    setTeacherEmail("");
    setGroupmateEmails("");
    setError("");
    setSuccessMessage("");
    onClose();
  };

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const contentStyle = {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxWidth: 600,
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1f2937",
    margin: 0,
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "2rem",
    color: "#6b7280",
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
    transition: "color 0.2s",
  };

  const bodyStyle = {
    padding: "1.5rem",
  };

  const formGroupStyle = {
    marginBottom: "1.25rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.5rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: "1rem",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical",
  };

  const messageStyle = (isError) => ({
    padding: "0.75rem",
    borderRadius: 8,
    marginBottom: "1rem",
    backgroundColor: isError ? "#fee2e2" : "#d1fae5",
    color: isError ? "#991b1b" : "#065f46",
    fontSize: "0.95rem",
    fontWeight: 500,
  });

  const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    padding: "1.5rem",
    borderTop: "1px solid #e5e7eb",
  };

  const buttonStyle = (isPrimary) => ({
    padding: "0.75rem 1.5rem",
    borderRadius: 8,
    border: "none",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: isCreating ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    backgroundColor: isPrimary ? "#1e3a8a" : "#e5e7eb",
    color: isPrimary ? "#fff" : "#374151",
    opacity: isCreating ? 0.6 : 1,
  });

  return (
    <div style={modalStyle} onClick={handleCancel}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Add New Project</h2>
          <button 
            style={closeButtonStyle} 
            onClick={handleCancel}
            onMouseEnter={(e) => e.target.style.color = "#1f2937"}
            onMouseLeave={(e) => e.target.style.color = "#6b7280"}
          >
            ×
          </button>
        </div>

        <div style={bodyStyle}>
          {error && <div style={messageStyle(true)}>{error}</div>}
          {successMessage && <div style={messageStyle(false)}>{successMessage}</div>}

          <div style={formGroupStyle}>
            <label style={labelStyle}>Project Name</label>
            <input
              type="text"
              style={inputStyle}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Teacher Email (optional)</label>
            <input
              type="email"
              style={inputStyle}
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="Enter teacher email"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Groupmate Emails</label>
            <textarea
              style={textareaStyle}
              value={groupmateEmails}
              onChange={(e) => setGroupmateEmails(e.target.value)}
              placeholder="Enter emails separated by commas"
            />
          </div>
        </div>

        <div style={footerStyle}>
          <button 
            style={buttonStyle(false)} 
            onClick={handleCancel}
            disabled={isCreating}
          >
            Cancel
          </button>
          <button 
            style={buttonStyle(true)} 
            onClick={handleSubmit}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProject;
