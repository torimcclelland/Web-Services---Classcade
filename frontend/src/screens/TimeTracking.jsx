import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideBar from "../components/Sidebar";
import PrimaryButton from "../components/PrimaryButton";
import TimeTrackingStyle from "../styles/TimeTrackingStyle";
import api from "../api";

const TimeTracking = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [minutes, setMinutes] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user?._id) {
          setError("User not found in local storage");
          return;
        }

        const res = await api.get(`/api/project/user/${user._id}`);
        setProjects(res.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
      }
    };

    fetchProjects();
  }, [user]);

  const handleProjectChange = async (projectId) => {
    setSelectedProject(projectId);
    setTasks([]);
    setSelectedTask("");

    try {
      if (!projectId) return;

      const res = await api.get(`/api/task/getByProject/${projectId}`);
      setTasks(res.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks for selected project.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject || !selectedTask || !minutes) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await api.post(`/api/project/${selectedProject}/track-time`, {
        userId: user._id,
        timeSpent: Number(minutes),
        completed,
      });

      alert("Time successfully logged!");
      setMinutes("");
      setCompleted(false);
    } catch (err) {
      console.error("Error submitting time:", err);
      alert("Failed to submit time.");
    }
  };

  const handleCancel = () => setShowCancelPopup(true);

  const confirmCancel = () => {
    setShowCancelPopup(false);
    setShowConfirmPopup(true);
    setTimeout(() => {
      setShowConfirmPopup(false);
      navigate("/dashboard");
    }, 1200);
  };

  const handleToggle = () => setCompleted(!completed);

  return (
    <div style={TimeTrackingStyle.container}>
      <TopNavBar />
      <div style={TimeTrackingStyle.layout}>
        <SideBar />
        <main style={TimeTrackingStyle.main}>
          <div style={TimeTrackingStyle.formPanel}>
            <h2 style={TimeTrackingStyle.title}>Time Tracking</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <label style={TimeTrackingStyle.label}>Select a Project</label>
            <select
              style={TimeTrackingStyle.select}
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              <option value="">Select a Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            <label style={TimeTrackingStyle.label}>Select a Task</label>
            <select
              style={TimeTrackingStyle.select}
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              disabled={!tasks.length}
            >
              <option value="">Select a Task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.name}
                </option>
              ))}
            </select>

            <label style={TimeTrackingStyle.label}>Minutes</label>
            <input
              type="number"
              style={TimeTrackingStyle.input}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />

            <div style={TimeTrackingStyle.row}>
              <label style={TimeTrackingStyle.switchLabel}>Completed?</label>
              <div
                style={{
                  ...TimeTrackingStyle.toggle,
                  backgroundColor: completed ? "#1e3a8a" : "#ccc",
                }}
                onClick={handleToggle}
              >
                <div
                  style={{
                    ...TimeTrackingStyle.toggleCircle,
                    left: completed ? 28 : 3,
                  }}
                />
              </div>
            </div>

            <div style={TimeTrackingStyle.actionButtons}>
              <PrimaryButton text="Cancel" onClick={handleCancel} />
              <PrimaryButton text="Submit" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>

      {showCancelPopup && (
        <div style={TimeTrackingStyle.overlay}>
          <div style={TimeTrackingStyle.popup}>
            <p style={TimeTrackingStyle.popupText}>
              Are you sure you want to cancel?
            </p>
            <div style={TimeTrackingStyle.popupButtons}>
              <PrimaryButton text="Yes" onClick={confirmCancel} />
              <PrimaryButton
                text="No"
                onClick={() => setShowCancelPopup(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div style={TimeTrackingStyle.overlay}>
          <div style={TimeTrackingStyle.popup}>
            <p style={TimeTrackingStyle.popupText}>Form cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracking;