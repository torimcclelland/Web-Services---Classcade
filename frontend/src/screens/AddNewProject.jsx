import React, { useState, useEffect } from "react";
import api from "../api";

const AddNewProject = ({ isOpen, onClose, onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [groupmateEmails, setGroupmateEmails] = useState([""]);
  const [dueDate, setDueDate] = useState("");
  const [projectNameError, setProjectNameError] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [teacherEmailError, setTeacherEmailError] = useState("");
  const [groupmateEmailErrors, setGroupmateEmailErrors] = useState([""]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setProjectName("");
      setTeacherEmail("");
      setGroupmateEmails([""]);
      setDueDate("");
      setProjectNameError("");
      setDueDateError("");
      setTeacherEmailError("");
      setGroupmateEmailErrors([""]);
      setSuccessMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addEmailField = () => {
    setGroupmateEmails([...groupmateEmails, ""]);
  };

  const updateEmailField = (index, value) => {
    const updated = [...groupmateEmails];
    updated[index] = value;
    setGroupmateEmails(updated);
    const updatedErrors = [...groupmateEmailErrors];
    updatedErrors[index] = "";
    setGroupmateEmailErrors(updatedErrors);
  };

  const removeEmailField = (index) => {
    const updated = groupmateEmails.filter((_, i) => i !== index);
    setGroupmateEmails(updated);
    const updatedErrors = groupmateEmailErrors.filter((_, i) => i !== index);
    setGroupmateEmailErrors(updatedErrors.length > 0 ? updatedErrors : [""]);
  };

  // Validate email format
  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if user exists with this email
  const checkEmailExists = async (email) => {
    try {
      await api.get(`/api/user/email/${email}`);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Validate a single email (format only - existence checked separately)
  const validateEmail = async (email) => {
    if (!email || email.trim() === "") {
      return ""; // Empty is valid (optional field)
    }

    if (!isValidEmailFormat(email)) {
      return "Please enter a valid email address";
    }

    return ""; // No error
  };

  const handleSubmit = async () => {
    // Clear all previous errors
    setProjectNameError("");
    setDueDateError("");
    setTeacherEmailError("");
    setGroupmateEmailErrors(groupmateEmails.map(() => ""));
    setSuccessMessage("");

    let hasError = false;

    // Validate project name
    if (!projectName.trim()) {
      setProjectNameError("Project name is required");
      hasError = true;
    }

    // Validate due date
    if (dueDate) {
      const tdy = new Date();
      tdy.setHours(0, 0, 0, 0);
      const selected = new Date(dueDate);

      if (selected < tdy) {
        setDueDateError("Due date cannot be in the past");
        hasError = true;
      }
    }

    // Validate teacher email format
    if (teacherEmail && teacherEmail.trim()) {
      const teacherError = await validateEmail(teacherEmail);
      if (teacherError) {
        setTeacherEmailError(teacherError);
        hasError = true;
      }
    }

    // Validate groupmate email formats
    const emailErrors = [];
    for (let i = 0; i < groupmateEmails.length; i++) {
      const email = groupmateEmails[i];
      if (email && email.trim()) {
        const error = await validateEmail(email);
        emailErrors.push(error);
        if (error) {
          hasError = true;
        }
      } else {
        emailErrors.push("");
      }
    }
    setGroupmateEmailErrors(emailErrors);

    // Stop if there are any format errors
    if (hasError) {
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setProjectNameError("User not logged in");
      return;
    }

    // Filter out own email and check existence of others
    const allEmails = groupmateEmails
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
      .filter((email) => email !== user.email.toLowerCase());

    const existingUsers = [];
    const nonExistingEmails = [];

    for (const email of allEmails) {
      const exists = await checkEmailExists(email);
      if (exists) {
        existingUsers.push(email);
      } else {
        nonExistingEmails.push(email);
      }
    }

    // If there are non-existing emails, show invitation dialog
    if (nonExistingEmails.length > 0) {
      setPendingInvites(nonExistingEmails);
      setShowInviteDialog(true);
      return;
    }

    // Proceed with project creation
    await createProject(existingUsers, []);
  };

  const createProject = async (existingUsers, invitedEmails) => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    setIsCreating(true);
    try {
      const response = await api.post("/api/project/create", {
        userId: user._id,
        name: projectName,
        teacherEmail: teacherEmail.trim(),
        groupmateEmails: existingUsers,
        dueDate,
      });

      // Send invites to non-existing users
      if (invitedEmails.length > 0) {
        for (const email of invitedEmails) {
          try {
            await api.post('/api/user/invite', {
              email: email,
              projectId: response.data._id,
              projectName: projectName,
              inviterName: `${user.firstName} ${user.lastName}`
            });
          } catch (err) {
            console.error(`Failed to send invite to ${email}:`, err);
          }
        }
      }

      setSuccessMessage("Project created successfully!");

      setTimeout(() => {
        if (onProjectCreated) {
          onProjectCreated(response.data);
        }
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setProjectNameError(
        err.response?.data?.error || "Error creating project"
      );
    } finally {
      setIsCreating(false);
      setShowInviteDialog(false);
      setPendingInvites([]);
    }
  };

  const handleProceedWithInvites = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const allEmails = groupmateEmails
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
      .filter((email) => email !== user.email.toLowerCase());

    const existingUsers = allEmails.filter(
      (email) => !pendingInvites.includes(email)
    );

    createProject(existingUsers, pendingInvites);
  };

  const handleCancelInvites = () => {
    setShowInviteDialog(false);
    setPendingInvites([]);
  };

  const handleCancel = () => {
    setProjectName("");
    setTeacherEmail("");
    setGroupmateEmails([""]);
    setDueDate("");
    setProjectNameError("");
    setDueDateError("");
    setTeacherEmailError("");
    setGroupmateEmailErrors([""]);
    setSuccessMessage("");
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

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

  const messageStyle = (isError) => ({
    padding: "0.75rem",
    borderRadius: 8,
    marginBottom: "1rem",
    backgroundColor: isError ? "#fee2e2" : "#d1fae5",
    color: isError ? "#991b1b" : "#065f46",
    fontSize: "0.95rem",
    fontWeight: 500,
  });

  const errorTextStyle = {
    color: "#dc2626",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
    display: "block",
  };

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
            onMouseEnter={(e) => (e.target.style.color = "#1f2937")}
            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
          >
            ×
          </button>
        </div>

        <div style={bodyStyle}>
          {successMessage && (
            <div style={messageStyle(false)}>{successMessage}</div>
          )}

          <div style={formGroupStyle}>
            <label style={labelStyle}>Project Name</label>
            <input
              type="text"
              maxLength={20}
              style={inputStyle}
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setProjectNameError("");
              }}
              placeholder="Enter project name"
            />
            {projectNameError && (
              <span style={errorTextStyle}>{projectNameError}</span>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Project Due Date</label>
            <input
              type="date"
              style={inputStyle}
              min={today}
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setDueDateError("");
              }}
            />
            {dueDateError && <span style={errorTextStyle}>{dueDateError}</span>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Teacher Email (optional)</label>
            <input
              type="email"
              maxLength={45}
              style={inputStyle}
              value={teacherEmail}
              onChange={(e) => {
                setTeacherEmail(e.target.value);
                setTeacherEmailError("");
              }}
              placeholder="Enter teacher email"
            />
            {teacherEmailError && (
              <span style={errorTextStyle}>{teacherEmailError}</span>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Groupmate Emails</label>

            {groupmateEmails.map((email, index) => (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <input
                    type="email"
                    style={{ ...inputStyle, flex: 1 }}
                    value={email}
                    placeholder={`Groupmate email #${index + 1}`}
                    onChange={(e) => updateEmailField(index, e.target.value)}
                  />
                  <button
                    onClick={() => removeEmailField(index)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#dc2626",
                      fontSize: "1.2rem",
                    }}
                  >
                    ✕
                  </button>
                </div>
                {groupmateEmailErrors[index] && (
                  <span style={{ ...errorTextStyle, marginBottom: "0.5rem" }}>
                    {groupmateEmailErrors[index]}
                  </span>
                )}
              </div>
            ))}

            <button
              onClick={addEmailField}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                backgroundColor: "#f9fafb",
                cursor: "pointer",
                fontWeight: 600,
                marginTop: "0.5rem",
              }}
            >
              + Add Groupmate
            </button>
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

      {showInviteDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: "2rem",
              maxWidth: 500,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Users Not Found
            </h3>
            <p style={{ marginBottom: "1rem", color: "#374151" }}>
              The following email(s) are not registered:
            </p>
            <ul style={{ marginBottom: "1.5rem", color: "#374151" }}>
              {pendingInvites.map((email, idx) => (
                <li key={idx}>{email}</li>
              ))}
            </ul>
            <p style={{ marginBottom: "1.5rem", color: "#374151" }}>
              Would you like to send them an invitation to join Classcade and
              this project?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <button
                style={buttonStyle(false)}
                onClick={handleCancelInvites}
              >
                Cancel
              </button>
              <button
                style={buttonStyle(true)}
                onClick={handleProceedWithInvites}
              >
                Send Invites
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewProject;
