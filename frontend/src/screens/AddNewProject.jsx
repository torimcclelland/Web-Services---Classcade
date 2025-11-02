import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import PrimaryButton from "../components/PrimaryButton";
import api from "../api";
import AddNewGroupStyle from "../styles/AddNewGroupStyle";

const AddNewProject = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [groupmateEmails, setGroupmateEmails] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!groupName.trim()) {
      setError("Group name is required");
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
        name: groupName,
        teacherEmail,
        groupmateEmails: emails,
      });

      alert("Group created successfully!");
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
    <div style={AddNewGroupStyle.container}>
      <TopNavBar />

      <main style={{ ...AddNewGroupStyle.main, marginLeft: 0 }}>
        <div style={AddNewGroupStyle.formPanel}>
          <h2 style={AddNewGroupStyle.title}>Add New Project</h2>

          <label style={AddNewGroupStyle.label}>Project Name</label>
          <input
            type="text"
            style={AddNewGroupStyle.input}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter project name"
          />

            <label style={AddNewGroupStyle.label}>Teacher Email (optional)</label>
            <input
              type="email"
              style={AddNewGroupStyle.input}
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="Enter teacher email"
            />

          <label style={AddNewGroupStyle.label}>Groupmate Emails</label>
          <textarea
            style={{ ...AddNewGroupStyle.input, height: "80px" }}
            value={groupmateEmails}
            onChange={(e) => setGroupmateEmails(e.target.value)}
            placeholder="Enter emails separated by commas"
          />

          {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

            <div style={AddNewGroupStyle.actionButtons}>
              <PrimaryButton text="Cancel" onClick={handleCancel} />
              <PrimaryButton text="Create" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>

      {showCancelPopup && (
        <div style={AddNewGroupStyle.overlay}>
          <div style={AddNewGroupStyle.popup}>
            <p style={AddNewGroupStyle.popupText}>
              Are you sure you want to cancel?
            </p>
            <div style={AddNewGroupStyle.popupButtons}>
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
