import React, { useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import TimeTrackingStyle from "../styles/TimeTrackingStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";

const TimeTracking = ({ isOpen, onClose }) => {
  const { selectedProject } = useProject();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [minutes, setMinutes] = useState("");
  const [completed, setCompleted] = useState(false);
  const [popup, setPopup] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!isOpen) {
      // Reset form when closed
      setSelectedTask("");
      setMinutes("");
      setCompleted(false);
      setPopup("");
      return;
    }

    if (!selectedProject?._id) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/api/task/${selectedProject._id}`);
        setTasks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        showPopup("Error loading tasks.");
      }
    };

      fetchTasks();
  }, [isOpen, selectedProject]);  const showPopup = (msg) => {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleMinutesChange = (e) => {
    const v = e.target.value;
    if (v === "") {
      setMinutes("");
      return;
    }
    // allow typing decimals but store as integer
    const n = Math.floor(Number(v));
    if (Number.isNaN(n)) return;
    setMinutes(String(Math.max(0, Math.min(999, n))));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTask || !minutes) {
      showPopup("Please select task & minutes");
      return;
    }

    try {
      await api.post(`/api/time-tracking`, {
        userId: user._id,
        projectId: selectedProject._id,
        taskId: selectedTask,
        minutes: Number(minutes),
        completed,
      });

      showPopup("Time logged");
      setTimeout(() => {
        setMinutes("");
        setCompleted(false);
        setSelectedTask("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to log time:", err);
      showPopup("Error logging time");
    }
  };

  if (!isOpen) return null;

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
    maxWidth: 500,
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

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            Time Tracking ({selectedProject?.name})
          </h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => (e.target.style.color = "#1f2937")}
            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
          >
            ×
          </button>
        </div>

        <div style={bodyStyle}>

            <label style={TimeTrackingStyle.label}>Select Task</label>
            <select
              style={TimeTrackingStyle.select}
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">-- Select Task --</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.name}
                </option>
              ))}
            </select>

            <label style={TimeTrackingStyle.label}>Minutes</label>
            <input
              type="number"
              min={0}
              max={999}
              style={{ ...TimeTrackingStyle.input, width: "100px" }}
              value={minutes}
              onChange={handleMinutesChange}
            />

            <div style={TimeTrackingStyle.row}>
              <label style={TimeTrackingStyle.switchLabel}>Completed?</label>
              <div
                style={{
                  ...TimeTrackingStyle.toggle,
                  backgroundColor: completed ? "#1e3a8a" : "#ccc",
                }}
                onClick={() => setCompleted(!completed)}
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
              <PrimaryButton
                text="Cancel"
                onClick={onClose}
              />
              <PrimaryButton text="Submit" onClick={handleSubmit} />
            </div>

          {popup && (
            <div style={TimeTrackingStyle.popupContainer}>
              <div style={TimeTrackingStyle.popupMessage}>{popup}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
