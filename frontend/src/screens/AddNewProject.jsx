import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import PrimaryButton from "../components/PrimaryButton";
import api from "../api";
import AddNewProjectStyle from "../styles/AddNewProjectStyle";

const AddNewProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [groupmateEmails, setGroupmateEmails] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

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

    try {
      await api.post("/api/project/create", {
        userId: user._id,
        name: projectName,
        teacherEmail,
        groupmateEmails: emails,
      });

      alert("Project created successfully!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error creating project");
    }
  };

  const handleCancel = () => setShowCancelPopup(true);

  const confirmCancel = () => {
    setShowCancelPopup(false);
    navigate("/home");
  };

  return (
    <div style={AddNewProjectStyle.container}>
      <TopNavBar />

      <main style={{ ...AddNewProjectStyle.main, marginLeft: 0 }}>
        <div style={AddNewProjectStyle.formPanel}>
          <h2 style={AddNewProjectStyle.title}>Add New Project</h2>

          <label style={AddNewProjectStyle.label}>Project Name</label>
          <input
            type="text"
            style={AddNewProjectStyle.input}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />

          <label style={AddNewProjectStyle.label}>
            Teacher Email (optional)
          </label>
          <input
            type="email"
            style={AddNewProjectStyle.input}
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            placeholder="Enter teacher email"
          />

          <label style={AddNewProjectStyle.label}>Groupmate Emails</label>
          <textarea
            style={{ ...AddNewProjectStyle.input, height: "80px" }}
            value={groupmateEmails}
            onChange={(e) => setGroupmateEmails(e.target.value)}
            placeholder="Enter emails separated by commas"
          />

          {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

          <div style={AddNewProjectStyle.actionButtons}>
            <PrimaryButton text="Cancel" onClick={handleCancel} />
            <PrimaryButton text="Create" onClick={handleSubmit} />
          </div>
        </div>
      </main>

      {showCancelPopup && (
        <div style={AddNewProjectStyle.overlay}>
          <div style={AddNewProjectStyle.popup}>
            <p style={AddNewProjectStyle.popupText}>
              Are you sure you want to cancel?
            </p>
            <div style={AddNewProjectStyle.popupButtons}>
              <PrimaryButton text="Yes" onClick={confirmCancel} />
              <PrimaryButton
                text="No"
                onClick={() => setShowCancelPopup(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewProject;
